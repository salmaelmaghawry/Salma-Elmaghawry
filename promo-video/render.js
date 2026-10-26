// usage: node render.js <page.html> <out.mp4|dir> [--stills t1,t2,...]
// size, length and fps come from window.VIDEO in the page (defaults: 1920x1080, 60s, 30fps)
// pages that define window.sfx() also get a sound track, synthesised by sfx.py and muxed in
// env: Q="sfx=enter" adds page query params, SEG="15.3,19.5" renders only that slice (for previews)
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const [page_, out, flag, list] = process.argv.slice(2);
const exe = path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell');

(async () => {
  const browser = await chromium.launch({ executablePath: exe, args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1920 } });
  await page.goto('file://' + path.resolve(page_) + '?render=1' + (process.env.Q ? '&' + process.env.Q : ''));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => window.READY);  // pages that preload frame sequences expose a promise
  const { w, h, dur, fps } = await page.evaluate(() => Object.assign({ w: 1920, h: 1080, dur: 60, fps: 30 }, window.VIDEO));
  await page.setViewportSize({ width: w, height: h });
  const stage = await page.$('#stage');

  if (flag === '--audio') {
    // rebuild only the sound track of an already rendered <out.mp4>
    const events = await page.evaluate(() => window.sfx());
    const json = out.replace(/\.mp4$/, '.sfx.json'), wav = out.replace(/\.mp4$/, '.wav'), tmp = out.replace(/\.mp4$/, '.tmp.mp4');
    fs.writeFileSync(json, JSON.stringify(events));
    execFileSync('python3', [path.join(__dirname, 'sfx.py'), json, String(dur), wav], { stdio: 'inherit' });
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', out, '-i', wav, '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
      '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', tmp], { stdio: 'inherit' });
    fs.renameSync(tmp, out);
    [json, wav].forEach(f => fs.unlinkSync(f));
  } else if (flag === '--stills') {
    for (const t of list.split(',').map(Number)) {
      await page.evaluate(t => render(t), t);
      await stage.screenshot({ path: path.join(out, `t${String(t).padStart(5, '0')}.png`) });
    }
  } else {
    const events = await page.evaluate(() => window.sfx ? window.sfx() : null);
    const video = events ? out.replace(/\.mp4$/, '.video.mp4') : out;
    const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', video],
      { stdio: ['pipe', 'ignore', 'inherit'] });
    const [a, b] = process.env.SEG ? process.env.SEG.split(',').map(Number) : [0, dur];
    const N = Math.round(fps * b);
    for (let i = Math.round(fps * a); i < N; i++) {
      await page.evaluate(t => render(t), i / fps);
      const buf = await stage.screenshot({ type: 'jpeg', quality: 95 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 150 === 0) console.log(`frame ${i}/${N}`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
    if (events) {
      const json = out.replace(/\.mp4$/, '.sfx.json'), wav = out.replace(/\.mp4$/, '.wav');
      fs.writeFileSync(json, JSON.stringify(events));
      execFileSync('python3', [path.join(__dirname, 'sfx.py'), json, String(b - a), wav, String(a)], { stdio: 'inherit' });
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', video, '-i', wav, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
        '-shortest', '-movflags', '+faststart', out], { stdio: 'inherit' });
      [json, wav, video].forEach(f => fs.unlinkSync(f));
    }
  }
  await browser.close();
})();
