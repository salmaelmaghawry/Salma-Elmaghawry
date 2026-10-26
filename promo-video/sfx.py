# usage: python3 sfx.py <events.json> <duration_s> <out.wav> [offset_s]
# Builds the sound track from the page's window.sfx() events. No music and no pitched notes:
# every sound is shaped noise (key clicks, whooshes, swipes, taps) over a very quiet room tone.
import json, sys, wave
import numpy as np

SR = 44100
rng = np.random.default_rng(7)


def band(x, lo=None, hi=None, order=4):
    """Smooth Butterworth-shaped band filter applied in the frequency domain."""
    n = len(x)
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(n, 1 / SR) + 1e-9
    g = np.ones_like(f)
    if lo: g /= np.sqrt(1 + (lo / f) ** (2 * order))
    if hi: g /= np.sqrt(1 + (f / hi) ** (2 * order))
    return np.fft.irfft(X * g, n)


def env(n, attack, tau):
    t = np.arange(n) / SR
    return np.minimum(t / max(attack, 1e-4), 1) * np.exp(-t / tau)


def norm(x):
    return x / (np.max(np.abs(x)) + 1e-9)


def key(space=False, big=False):
    """One key press + release: bright transient, short plastic body, quieter release click.
    space/big (Return) get a deeper, longer body."""
    n = int(.16 * SR)
    out = np.zeros(n)
    j = rng.uniform(.85, 1.15)
    tr = band(rng.standard_normal(int(.012 * SR)), lo=1800 * j, hi=9000) * env(int(.012 * SR), .0002, .0013)
    lo, hi, tau = (130, 520, .024) if big else (150, 600, .016) if space else (260 * j, 950 * j, .009)
    body = band(rng.standard_normal(int(.06 * SR)), lo=lo, hi=hi) * env(int(.06 * SR), .0008, tau)
    out[:len(tr)] += norm(tr) * .55
    out[:len(body)] += norm(body) * (.7 if big else .55 if space else .38)
    r = int(rng.uniform(.07, .1) * SR)
    rel = band(rng.standard_normal(int(.01 * SR)), lo=2200, hi=9000) * env(int(.01 * SR), .0002, .001)
    out[r:r + len(rel)] += norm(rel) * .22
    return out * rng.uniform(.75, 1)


def sweep(dur, f0, f1, f2, width=.55):
    """Noise through a band-pass whose centre glides f0 -> f1 -> f2 (log), STFT overlap-add."""
    n = int(dur * SR)
    x = rng.standard_normal(n + 2048)
    win, hop = np.hanning(2048), 512
    out = np.zeros_like(x)
    wsum = np.zeros_like(x)
    f = np.fft.rfftfreq(2048, 1 / SR) + 1e-9
    for s in range(0, n, hop):
        u = min(s / n, 1)
        fc = np.exp(np.interp(u, [0, .5, 1], np.log([f0, f1, f2])))
        g = np.exp(-.5 * (np.log2(f / fc) / width) ** 2)
        seg = np.fft.irfft(np.fft.rfft(x[s:s + 2048] * win) * g, 2048) * win
        out[s:s + 2048] += seg
        wsum[s:s + 2048] += win ** 2
    out = out[:n] / np.maximum(wsum[:n], 1e-3)
    u = np.linspace(0, 1, n)
    return norm(out * np.sin(np.pi * u) ** 2)


def tick():
    n = int(.03 * SR)
    a = band(rng.standard_normal(n), lo=2500, hi=10000) * env(n, .0002, .0012)
    b = band(rng.standard_normal(n), lo=700, hi=1800) * env(n, .0005, .004)
    return norm(a) * .6 + norm(b) * .3


def tap():
    n = int(.06 * SR)
    return norm(band(rng.standard_normal(n), lo=180, hi=900) * env(n, .001, .012)) * .8


def pop():
    n = int(.18 * SR)
    out = norm(band(rng.standard_normal(n), hi=220) * env(n, .002, .045))
    t = tick()
    out[:len(t)] += .25 * t
    return norm(out)


def place(buf, x, t, gain, pan=0.0):
    i = int(t * SR)
    if i >= buf.shape[1]: return
    x = x[:buf.shape[1] - i] * gain
    buf[0, i:i + len(x)] += x * np.sqrt((1 - pan) / 2)
    buf[1, i:i + len(x)] += x * np.sqrt((1 + pan) / 2)


def main(path, dur, out, offset=0.0):
    events = [dict(e, t=e['t'] - offset) for e in json.load(open(path)) if e['t'] - offset > -1]
    n = int(dur * SR)
    buf = np.zeros((2, n))
    db = lambda d: 10 ** (d / 20)
    for e in events:
        k, t = e['k'], e['t']
        if k in ('key', 'space'):
            place(buf, key(k == 'space'), t, db(e.get('g', -13)), rng.uniform(-.15, .15))
        elif k == 'enter':
            place(buf, key(big=True), t, db(-15))
        elif k == 'whoosh':
            w = sweep(e.get('d', .7) + .15, 300, 1700, 600)
            # pan follows the sage line across the screen, left to right
            m = len(w); p = np.linspace(-.6, .6, m)
            i = int(max(t - .05, 0) * SR); m = min(m, n - i)
            buf[0, i:i + m] += w[:m] * db(-17) * np.sqrt((1 - p[:m]) / 2)
            buf[1, i:i + m] += w[:m] * db(-17) * np.sqrt((1 + p[:m]) / 2)
        elif k == 'soft':
            place(buf, sweep(.45, 400, 1200, 500), t, db(-23))
        elif k == 'swipe':
            place(buf, sweep(.3, 900, 2600, 1500, .45), t - .05, db(-25), .3)
        elif k == 'tick':
            place(buf, tick(), t, db(-22))
        elif k == 'tap':
            place(buf, tap(), t, db(-24), rng.uniform(-.2, .3))
        elif k == 'pop':
            place(buf, pop(), t, db(-21))
    # fixed master gain (same level in short previews and the full video), peaks kept under -1.5 dBFS
    buf *= db(16.5)
    buf *= min(1, db(-1.5) / max(np.max(np.abs(buf)), 1e-9))
    # very quiet room tone so the gaps between sounds are not dead silent
    bed = np.cumsum(rng.standard_normal(n))
    bed = band(bed - np.convolve(bed, np.ones(4410) / 4410, 'same'), lo=40, hi=420)
    bed *= db(-50) / np.sqrt(np.mean(bed ** 2))  # about -50 dBFS RMS
    bed *= np.minimum(np.minimum(np.arange(n) / (1.5 * SR), 1), np.minimum((n - np.arange(n)) / (2 * SR), 1))
    buf += bed
    pcm = (np.clip(buf.T, -1, 1) * 32767).astype('<i2')
    with wave.open(out, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())


if __name__ == '__main__':
    main(sys.argv[1], float(sys.argv[2]), sys.argv[3], float(sys.argv[4]) if len(sys.argv) > 4 else 0.0)
