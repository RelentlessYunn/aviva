# aviva studio: team handbook

Every agent on this project reads this file. It is the shared contract.

## The mission
We are making **aviva**: a parody "AI product launch" website for **a plain white sheet of paper**. It uses the same techniques and format as **ORYZO** (https://oryzo.ai), the parody launch site Lusion made for a cork coaster. aviva should feel like ORYZO's sibling, with the same deadpan premium storytelling and the same scroll-driven 3D craft. But it has its own look, jokes and interactions, so nobody could call it a copy.

The full mission, the KEEP / CHANGE rules and the section table are in `work/00-mission.md`. Read it before you start any task.

## Where we run
This project runs in a **Claude Code cloud session**: a Linux VM with no screen. That means:
- There is no visible browser. To see a page, use `tools/shoot.mjs` (headless Chromium with WebGL, see "Looking at pages"), or write a short Playwright script.
- Internet access depends on the environment's network setting. If a site can't be reached, say so in your report and work from `reference/` instead. Never try to get around a block.
- The VM can be reset when the session sits idle. Anything not committed and pushed can be lost, so the lead commits and pushes after every step.
- Git: we work on the session's own branch (the cloud can only push there). The lead opens a pull request into `main`; the user merges it.

## The team
| Agent | Owns | Writes to |
|---|---|---|
| project-lead (the main session) | Plan, delegation, decisions, quality bar, git, pull request | `work/PROGRESS.md`, `work/decisions.md`, `README.md`, `docs/CREDITS.md` |
| web-researcher | Facts about paper, AI-launch tropes to parody, WebGL technique research, fact-checks | `work/01-research.md`, `work/01b-tech-research.md`, `work/reviews/*-factcheck.md` |
| reference-analyst | Teardown of ORYZO; fidelity and similarity reviews of our build | `work/02-reference-teardown.md`, `work/reviews/*-fidelity.md` |
| creative-director | Concepts, story, jokes, every word of copy, creative reviews | `work/03-concepts.md`, `work/04-creative-brief.md`, `work/reviews/*-creative.md` |
| visual-designer | Art direction, design system, illustrations, icons, the 3D paper sheet's look (materials, shaders, deformations), the parody research paper; visual reviews | `work/05-design-system.md`, `docs/css/tokens.css`, `docs/assets/`, `docs/js/paper/`, `docs/lab/`, `docs/research/`, `work/reviews/*-visual.md` |
| web-developer | The website: HTML/CSS, the Three.js scene, scroll choreography, interactions, performance | `docs/index.html`, `docs/css/` (except tokens.css), `docs/js/` (except `js/paper/`), `docs/vendor/` |

Only write inside your own areas. If you need a change in someone else's area, say so in your final report and the lead will route it.

## Folder layout
```
docs/                 THE WEBSITE. GitHub Pages publishes only this folder.
  index.html
  css/  js/  assets/  vendor/  (three, gsap, lenis copied from npm)
  js/paper/           the 3D paper sheet module (visual-designer), used by the scene (web-developer)
  lab/                look-dev sandbox pages for the paper material
  research/           our parody "research paper" PDF, BibTeX and .obj
  .nojekyll  CREDITS.md  favicon.svg
tools/shoot.mjs       headless screenshot + console + FPS checker
package.json          tooling only (Playwright, and the libraries we copy into docs/vendor)
reference/            ORYZO study material: VIDEO_NOTES.md + 84 frames from the user's screen recording.
                      Never copied into docs/. The lead removes it in the final commit.
work/                 notes, briefs and reviews (committed); work/screenshots/ is not committed
README.md  LICENSE
```

## Looking at pages
- Install once per session: `npm install` (the lead does this in Phase 0).
- Serve our site: `npm run serve` in the background (serves `docs/` at http://localhost:8080); reuse it if it's already running.
- Screenshots: `node tools/shoot.mjs --url http://localhost:8080 --out work/screenshots/<folder> --label <name>`. It scrolls with real mouse-wheel events, screenshots every step at 1440×900 and 390×844 (change with `--sizes`, `--steps`, `--step-px`, `--wait`), and reports console errors, failed requests, WebGL support and download size. Add `--fps` for a frame-rate measurement. It uses software WebGL, so FPS is much lower than on a real GPU: compare between builds, don't treat it as real-device speed.
- Then open the screenshots with Read and actually look at them. Never judge visuals without looking.
- For hovers, clicks, typing or anything else, write a short Playwright script in `work/scripts/`, using the launch settings in `tools/shoot.mjs`.

## Rules for everyone
1. **Same technique, different everything else.** Learn from ORYZO's format, pacing, tone and 3D techniques. Never copy from Lusion: no code (their site code is not open source), no renders, splats, videos, illustrations, font files, copy, jokes or logo. The ORYZO-1 GitHub repo is MIT licensed but contains only their coaster models and paper; we use it only to understand the *format* of their academic section. The KEEP / CHANGE rules in `work/00-mission.md` are binding.
2. **Reference material stays out of the website.** Nothing from `reference/` goes into `docs/`.
3. **Tech: static site, no build step.** Copy pinned versions of three (plus the addons we use), gsap (with ScrollTrigger) and lenis from `node_modules` into `docs/vendor/`, keep their licence files, and load them with an import map using relative paths. Don't load scripts from CDNs, so the site works on GitHub Pages and inside the cloud VM. Google Fonts are fine, or self-host the font files in `docs/assets/fonts/`.
4. **One canvas, one scene.** One fixed full-screen WebGL canvas behind the DOM content; scroll position drives the 3D scene.
5. **Performance and robustness:** first load under about 3 MB; pixel ratio capped (2 on desktop, 1.5 on mobile); rendering pauses when the tab is hidden; a good-looking static fallback if WebGL is unavailable; `prefers-reduced-motion` gets a calm version.
6. **Quality bar:** responsive at 390px, 768px and 1440px; no console errors from our code; no broken links or images; semantic HTML; alt text; visible focus states; works with the keyboard; looks deliberate and premium, never templated.
7. **Write it down.** Your output lives in your files, not only in your final message. End every task with a short report: what you did, files changed, open problems, what you need from others.
8. **The jokes are absurd; the facts are true.** Any real-world fact about paper on the site must trace back to a source in `work/01-research.md`.
9. **Honest parody.** The footer says clearly that aviva is a fictional parody project, inspired by ORYZO by Lusion and not affiliated with Lusion. Testimonials come from obviously fictional characters, never real people. Nothing is for sale.
10. **Git is the lead's job.** Other agents don't commit, push, or change git settings.
