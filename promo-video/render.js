// usage: node render.js <page.html> <out.mp4|dir> [--stills t1,t2,...]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

const [page_, out, flag, list] = process.argv.slice(2);
const FPS = 30, DUR = 60;
const exe = path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell');

(async () => {
  const browser = await chromium.launch({ executablePath: exe, args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + path.resolve(page_) + '?render=1');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle');
  const stage = await page.$('#stage');

  if (flag === '--stills') {
    for (const t of list.split(',').map(Number)) {
      await page.evaluate(t => render(t), t);
      await stage.screenshot({ path: path.join(out, `t${String(t).padStart(5, '0')}.png`) });
    }
  } else {
    const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out],
      { stdio: ['pipe', 'ignore', 'inherit'] });
    const N = FPS * DUR;
    for (let i = 0; i < N; i++) {
      await page.evaluate(t => render(t), i / FPS);
      const buf = await stage.screenshot({ type: 'jpeg', quality: 95 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 150 === 0) console.log(`frame ${i}/${N}`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})();
