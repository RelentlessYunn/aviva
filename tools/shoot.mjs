#!/usr/bin/env node
// shoot.mjs: screenshot a scroll-driven (WebGL) website the way a visitor sees it.
//
// It scrolls with real mouse-wheel events (so Lenis / GSAP ScrollTrigger / scroll-hijacking
// sites react properly), takes a screenshot after every step at every viewport size, and
// writes a report with console errors, failed requests, WebGL support, download size and
// an optional frame-rate measurement.
//
// Usage:
//   node tools/shoot.mjs --url http://localhost:8080 --out work/screenshots/build/round-1
//   node tools/shoot.mjs --url https://oryzo.ai --out work/screenshots/reference/live --label oryzo --steps 40
//
// Options (all optional except --url):
//   --out <dir>          where to save images and report.json   (default: work/screenshots/shoot)
//   --label <name>       file-name prefix                         (default: shot)
//   --sizes <list>       viewports, e.g. 1440x900,768x1024,390x844 (default: 1440x900,390x844)
//   --steps <n>          number of scroll steps                   (default: 30)
//   --step-px <px>       wheel distance per step                  (default: 450)
//   --wait <ms>          wait after each step before the shot     (default: 900)
//   --first-wait <ms>    wait after page load (loaders, shaders)  (default: 4000)
//   --fps                also measure frames per second while scrolling
//   --full-page          one extra full-page screenshot per size (useful for DOM-heavy pages)
//
// Note: this runs headless with software WebGL (SwiftShader). Visuals are accurate, but
// frame rates are much lower than on a real GPU. Compare FPS between builds; don't read
// them as real-device numbers.

import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const opt = (name, def) => {
  const i = argv.indexOf(`--${name}`);
  if (i === -1) return def;
  const v = argv[i + 1];
  return v === undefined || v.startsWith('--') ? true : v;
};

const url = opt('url');
if (!url || url === true) {
  console.error('Missing --url. Example: node tools/shoot.mjs --url http://localhost:8080 --out work/screenshots/build/test');
  process.exit(2);
}
const out = opt('out', 'work/screenshots/shoot');
const label = opt('label', 'shot');
const sizes = String(opt('sizes', '1440x900,390x844')).split(',').map((s) => s.trim().split('x').map(Number));
const steps = Number(opt('steps', 30));
const stepPx = Number(opt('step-px', 450));
const wait = Number(opt('wait', 900));
const firstWait = Number(opt('first-wait', 4000));
const wantFps = opt('fps', false) === true;
const fullPage = opt('full-page', false) === true;

fs.mkdirSync(out, { recursive: true });

async function launch() {
  const args = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'];
  const candidates = [undefined, process.env.CHROME_PATH];
  const pwb = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (pwb && fs.existsSync(pwb)) {
    candidates.push(path.join(pwb, 'chromium'));
    for (const d of fs.readdirSync(pwb).filter((d) => d.startsWith('chromium-'))) {
      for (const sub of ['chrome-linux/chrome', 'chrome-linux64/chrome']) candidates.push(path.join(pwb, d, sub));
    }
  }
  candidates.push('/opt/pw-browsers/chromium', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome');
  let lastErr;
  for (const exe of [...new Set(candidates)]) {
    if (exe && !fs.existsSync(exe)) continue;
    try {
      return await chromium.launch({ headless: true, executablePath: exe, args });
    } catch (e) {
      lastErr = e;
    }
  }
  throw new Error(`Could not start Chromium. Run "npx playwright install chromium" (or set CHROME_PATH) and try again.\n${lastErr?.message ?? ''}`);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await launch();
const report = { url, when: new Date().toISOString(), sizes: [] };

for (const [w, h] of sizes) {
  const context = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    isMobile: w < 600,
    hasTouch: w < 600,
  });
  const page = await context.newPage();
  const entry = { size: `${w}x${h}`, console: [], pageErrors: [], failedRequests: [], badResponses: [], shots: [] };
  let bytes = 0;

  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') entry.console.push(`[${m.type()}] ${m.text()}`.slice(0, 400));
  });
  page.on('pageerror', (e) => entry.pageErrors.push(String(e).slice(0, 400)));
  page.on('requestfailed', (r) => entry.failedRequests.push(`${r.url()} (${r.failure()?.errorText})`.slice(0, 300)));
  page.on('response', (r) => {
    if (r.status() >= 400) entry.badResponses.push(`${r.status()} ${r.url()}`.slice(0, 300));
  });
  page.on('requestfinished', async (r) => {
    try {
      const s = await r.sizes();
      bytes += s.responseBodySize + s.responseHeadersSize;
    } catch {}
  });

  try {
    await page.goto(url, { waitUntil: 'load', timeout: 90000 });
  } catch (e) {
    entry.pageErrors.push(`navigation: ${String(e).slice(0, 300)}`);
  }
  await sleep(firstWait);
  entry.transferMB = +(bytes / 1e6).toFixed(2);

  entry.webgl = await page
    .evaluate(() => {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2') || c.getContext('webgl');
      return { supported: !!gl, canvasesOnPage: document.querySelectorAll('canvas').length };
    })
    .catch(() => null);

  await page.mouse.move(w / 2, h / 2);
  for (let i = 0; i <= steps; i++) {
    const file = path.join(out, `${label}-${w}x${h}-${String(i).padStart(3, '0')}.jpg`);
    await page.screenshot({ path: file, type: 'jpeg', quality: 80 });
    const pos = await page.evaluate(() => ({ y: Math.round(window.scrollY), max: document.documentElement.scrollHeight - innerHeight })).catch(() => ({}));
    entry.shots.push({ file, step: i, scrollY: pos.y, maxScroll: pos.max });
    if (i < steps) {
      if (w < 600) {
        await page.evaluate((d) => window.scrollBy(0, d), stepPx).catch(() => {});
      } else {
        await page.mouse.wheel(0, stepPx);
      }
      await sleep(wait);
    }
  }

  if (fullPage) {
    const file = path.join(out, `${label}-${w}x${h}-fullpage.jpg`);
    await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
    await sleep(wait);
    await page.screenshot({ path: file, type: 'jpeg', quality: 70, fullPage: true }).catch(() => {});
    entry.fullPage = file;
  }

  if (wantFps) {
    await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
    await sleep(wait);
    const fpsPromise = page.evaluate(
      () =>
        new Promise((resolve) => {
          let frames = 0;
          const t0 = performance.now();
          const tick = () => {
            frames++;
            if (performance.now() - t0 < 4000) requestAnimationFrame(tick);
            else resolve(+(frames / ((performance.now() - t0) / 1000)).toFixed(1));
          };
          requestAnimationFrame(tick);
        })
    );
    for (let i = 0; i < 14; i++) {
      await page.mouse.wheel(0, 250);
      await sleep(250);
    }
    entry.fps = await fpsPromise.catch(() => null);
  }

  report.sizes.push(entry);
  await context.close();
}

await browser.close();
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2));

for (const e of report.sizes) {
  console.log(`\n== ${e.size} ==`);
  console.log(`screenshots: ${e.shots.length} in ${out}`);
  console.log(`webgl: ${e.webgl?.supported ? 'yes' : 'NO'}, canvases on page: ${e.webgl?.canvasesOnPage ?? '?'}`);
  console.log(`first-load transfer: ${e.transferMB} MB`);
  if (e.fps !== undefined) console.log(`fps while scrolling (software WebGL, compare only): ${e.fps}`);
  const last = e.shots.at(-1);
  if (last) console.log(`scroll reached: ${last.scrollY} of ${last.maxScroll}px`);
  console.log(`console errors/warnings: ${e.console.length}${e.console.length ? '\n  ' + e.console.slice(0, 10).join('\n  ') : ''}`);
  console.log(`page errors: ${e.pageErrors.length}${e.pageErrors.length ? '\n  ' + e.pageErrors.slice(0, 10).join('\n  ') : ''}`);
  console.log(`failed requests: ${e.failedRequests.length}${e.failedRequests.length ? '\n  ' + e.failedRequests.slice(0, 10).join('\n  ') : ''}`);
  console.log(`HTTP errors: ${e.badResponses.length}${e.badResponses.length ? '\n  ' + e.badResponses.slice(0, 10).join('\n  ') : ''}`);
}
console.log(`\nFull report: ${path.join(out, 'report.json')}`);
