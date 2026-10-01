# 01b — Technique research (web-researcher, Task B)

Status: IN PROGRESS. Written topic by topic; sections marked TODO are filled in later in this file.
Pinned versions (verified with `npm view` on 2026-10-01 and in `node_modules/*/package.json`): **three 0.186.1, gsap 3.15.0, lenis 1.3.26**.

---------------------------------------------------------------------------------------------------

## 1. Lusion / ORYZO "Oryzo BTS" series: what I could and could not read

**Could not read the posts themselves.** `blog.lusion.co`, `oryzo.ai`, `x.com`, `tympanus.net` (Codrops), `discourse.threejs.org`, `yusually.it.com`, `utsubo.com`, `gsap.com` and `webflow.com` are all blocked by the egress proxy (`EGRESS_BLOCKED`). Everything below about the series comes from WebSearch result snippets and from GitHub (which is reachable).

What the search snippets establish (titles, dates, structure):

| Part | Title (from the blog's URL/titles) | Status seen in search |
|---|---|---|
| 1 / 7 | Concept and Creative Direction | Published (X post 2026-03/04). Oryzo is described as a year-long internal project; started early 2025 after a heavy client period; Lusion had never made a site for a *physical* product. |
| 2 / 7 | 3D Design and Motion Graphics (3D, motion graphics, visual systems behind the site and launch film) | Published 2 April 2026, ~12 min read. |
| 3 / 7 | Website UX/UI and Illustrations (keeping the interface quiet so content does the talking) | Published (X post 2026-04). |
| 4 / 7 | **WebGL / ThreeJS Tricks 1** | Listed in the Part 1-3 "series" checklists; search tools showed only Parts 1-3 as live in April 2026. I could not confirm whether Parts 4-7 are now live. |
| 5 / 7 | WebGL / ThreeJS Tricks 2 | as above |
| 6 / 7 | WebGL / ThreeJS Tricks 3 | as above |
| 7 / 7 | WebGL / ThreeJS Tricks 4 | as above |

Other facts from search results (secondary sources, not Lusion's own words): Oryzo won Awwwards Site of the Month (April 2026) plus a Developer Award; commentators describe "one hero object rendered live in Three.js with real weight and inertia, easing that mimics physics, and a scroll that moves the camera through true Z-axis depth rather than sliding 2D layers". A commenter on Part 3 asked about Gaussian splatting, which the mission notes says Lusion used for the photoreal desk scenes together with Houdini renders and photography.

**Conclusion for aviva:** the WebGL tricks of Parts 4-7 are unknown to me. I do not guess at them. The effect-level approach is below (topics 2-5); it is built from first principles and from open-source, GitHub-readable work.

### Things Lusion has published openly that ARE readable (MIT, GitHub) and are directly useful

1. **`lusionltd/WebGL-Scroll-Sync`** (MIT; Vite demo; README read in full, local clone in the scratchpad). It is Lusion's own stated answer to the problem "one WebGL canvas, many DOM elements, no scroll-jacking":
   - Native scroll is not on the same thread/timing as `requestAnimationFrame`, so a `position: fixed` canvas reading `scrollY` in rAF can lag/drift on touch devices.
   - Their trick: make the canvas `position: absolute` and, **every rAF, translate it to the current scroll offset**. If the browser scrolls between two frames, the canvas physically scrolls with the page, so 3D stays glued to the DOM; it never *drifts* but may *clip* at the viewport edge during fast scrolls.
   - Mitigations they name: render extra vertical padding (they use +25 % top and bottom), or render to a full-screen framebuffer and edge-blend.
   - For aviva (rule 4 says "one fixed full-screen canvas"): keep `position: fixed` (simplest, and our scene is not glued to specific DOM boxes; the sheet floats in screen space) and drive the scene from smoothed scroll (Lenis) **inside the same ticker**. Only if the sheet must stay locked to a DOM rectangle on touch devices (e.g. the "printed on aviva" zoom moment, the tier-picker stack), use their absolute-canvas + padding trick for that case. Idea only; write our own code.
2. **`lusionltd/ORYZO-1`**: coaster models + paper only (already studied by the lead).

### Public Oryzo-sibling projects on GitHub worth reading (technique, MIT-licensed or demos)

- **`hamzahossainX/Product-in-motion` ("ERASER-1", a vinyl eraser as an "open-weight AI model")**: raw three.js, Lenis, GSAP SplitText only, no ScrollTrigger. Summary read via WebFetch of its README: custom post chain written by hand (TAA with Halton jitter + depth reprojection, FXAA, bokeh, multi-mip bloom, ACES inside a colour-grade, **blue-noise dither before sRGB encode**, no post library); every frame "reset-then-claim": wipe colour grade/light/hero transform, then each visible section blends weighted claims by its scroll ratio, which gives free cross-fades between overlapping sections; each section owns a `ScrollRange` with `fit()` remapping, so scrubbing is deterministic backwards and forwards; geometry/materials/graphite dust generated in code; env map is a PMREM built at runtime; 18 draw calls, 208 kB gz JS; reduced-motion keeps the look but removes self-animation. This "reset-then-claim" frame loop is a very good pattern for aviva (see topic 4).
- **`huxlic/korvo`** (React Three Fiber + GSAP, Oryzo homage) and **`sakshamfit/oryzo`** (unrelated real-estate site, Lenis + ScrollTrigger + R3F, scroll-scrubbed frame sequence) exist but add little.
- **Codrops "Building an Interactive Crumpled Paper Effect with Houdini VAT and Three.js"** by Toi Nagasawa, 2026-09-19 (article blocked; **repo is readable**: `item-develop/paper-crumple-demo`, MIT; I cloned a fork `jarolinplasencio18-web/paper-crumple-demo` and read `src/paper-vat.js`). Technique: a Houdini Vellum crumple baked to Vertex Animation Textures (50 frames, ~3500 points, FBX 1.2 MB + EXR 1.7 MB), decoded on the CPU into per-frame position/normal arrays, smooth normals computed per *point id* (the mesh is a triangle soup, so computeVertexNormals would give faceted shading), plus cannon-es for throwing. **Useful lesson for aviva:** a real crumple is a baked simulation; we have no Houdini, and 3 MB would blow our budget, so we bake our own tiny one (see crumple in topic 2).
- **Amanda Ghassaei's Origami Simulator** (`amandaghassaei/OrigamiSimulator`, MIT; paper "Fast, Interactive Origami Simulation using GPU Computation", Ghassaei/Demaine/Gershenfeld, 7OSME): GPU dynamic relaxation of a triangulated crease pattern (pin-jointed truss + angular constraints), three.js rendering. Used here as the reference for "what physically-correct folding looks like"; we choose a cheaper kinematic approach (topic 2).

Sources for this topic: blog.lusion.co/oryzo-bts-part-1-7-concept-and-creative-direction, ...-part-3-7-website-ux-ui-and-illustrations (URLs from search results; not fetchable), x.com/lusionltd status posts (search snippets), github.com/lusionltd (WebFetch), github.com/lusionltd/WebGL-Scroll-Sync (cloned, README read), github.com/hamzahossainX/Product-in-motion (WebFetch), github.com/jarolinplasencio18-web/paper-crumple-demo (cloned; `src/paper-vat.js` read), github.com/amandaghassaei/OrigamiSimulator (search snippet).

---------------------------------------------------------------------------------------------------

## 6. Self-hosting the libraries (verified against `node_modules`)

### 6.1 Versions and licences

| Package | Version (npm latest 2026-10-01 == installed) | Licence | Licence file shipped in the npm tarball? |
|---|---|---|---|
| three | 0.186.1 | MIT ("Copyright 2010-2026 Three.js Authors") | yes: `node_modules/three/LICENSE` |
| lenis | 1.3.26 | MIT (darkroom.engineering) | yes: `node_modules/lenis/LICENSE` |
| gsap | 3.15.0 | **Standard "No Charge" GSAP License** (package.json `"license": "Standard 'no charge' license: https://gsap.com/standard-license"`) | **No LICENSE file in the tarball.** The licence is referenced from every file header (`@license Copyright 2008-2026, GreenSock. All rights reserved. Subject to the terms at https://gsap.com/standard-license`) and from `README.md` |

**GSAP licence, exactly** (text of the "Standard 'No Charge' GSAP License", effective April 30, 2025, read from the ScanCode licence database on GitHub since gsap.com is blocked here: `aboutcode-org/scancode-toolkit/.../gsap-standard-no-charge-2025.LICENSE`; the gsap README confirms "GSAP is now 100% FREE including ALL of the bonus plugins ... even for commercial use", thanks to Webflow):
- **Grant:** Webflow grants a non-exclusive, worldwide licence "to use, reproduce, display, and implement GSAP Products solely for Permitted Uses". **Permitted Uses** = use "on any website, web application, or digital interface by any person or entity" (including companies competing with Webflow in other areas).
- **Prohibited Uses:** using GSAP "in tools that allow users to build visual animations without code that encourages, induces, or materially assists in creating a solution that competes with Webflow's visual animation building capabilities". **Restrictions:** no Prohibited Uses without written consent; no reverse-engineering GSAP to create Competitive Products (visual animation builders); **do not remove or alter proprietary notices or branding** from GSAP products.
- **Verdict for aviva:** a free public parody website is a plain Permitted Use. Self-hosting copies of the files is "reproduce/display/implement". Obligation: keep the `/*! ... @license ... */` headers intact in the copied files (do not strip them when minifying; esbuild's `--legal-comments=inline` keeps `/*!` comments). Webflow may update the licence; the licence says updates will not materially degrade use. Because the tarball has no LICENSE file, ship `docs/vendor/gsap/LICENSE.txt` containing: the licence name, the URL, the effective date, and the three restrictions above (summary, with the URL as the authority), and list GSAP in `docs/CREDITS.md`.
- Not an OSI open-source licence. Do not describe aviva's vendor folder as "all MIT": say "three and lenis: MIT; gsap: GreenSock Standard No-Charge License".

### 6.2 What to copy (all paths verified; every relative import inside the copied files resolves)

```
docs/vendor/
  three/three.module.js        (imports ./three.core.js, so BOTH are needed; there is no three.module.min.js in 0.186)
  three/three.core.js
  three/LICENSE
  three/addons/...             mirror of node_modules/three/examples/jsm/<path>; addons do `from 'three'` and relative imports
  gsap/index.js  gsap-core.js  CSSPlugin.js  ScrollTrigger.js  Observer.js   (+ LICENSE.txt we write)
  lenis/lenis.mjs  lenis.css  LICENSE
```
- `gsap/index.js` imports `./gsap-core.js` and `./CSSPlugin.js`; it exports `gsap` (named and default). `ScrollTrigger.js` imports only `./Observer.js` and exports `ScrollTrigger` (named + default). Do NOT use `gsap/all.js` (pulls in every plugin).
- `lenis.mjs` has no imports, `export { Lenis as default }`. The package `exports` map points `lenis` to `dist/lenis.mjs`. Do not use `lenis.min.js` (UMD, global) with the import map.
- Addons proposed (transitive imports resolved by the script; sizes unminified): `environments/RoomEnvironment` (5 kB), `postprocessing/EffectComposer + RenderPass + ShaderPass + OutputPass` (+ Pass, MaskPass, `shaders/CopyShader`, `shaders/OutputShader`) (~30 kB), `utils/BufferGeometryUtils` (38 kB), `misc/GPUComputationRenderer` (14 kB; for ping-pong simulations such as the ink microscope), `math/ImprovedNoise` (3 kB). Optional: `SMAAPass` (+SMAAShader, 65 kB; not needed when the composer target is multisampled), `UnrealBloomPass` (avoid), `lights/RectAreaLightUniformsLib` (**315 kB** of LTC tables: skip), `loaders/GLTFLoader`.
- Not needed (we generate everything in code): any loader, `three.webgpu.js`, `three.tsl.js`, `three.cjs`.
- Verified pitfall: `lenis.css` contains `html.lenis, html.lenis body { height: auto; }`, which **overrides a `body { height: 400vh }`**: the page then has no scroll height. Give the scroll height to a wrapper element (`<main>`), never to `body`.

### 6.3 Size budget (measured)

| | raw | gzip -9 | esbuild-minified | minified + gzip |
|---|---|---|---|---|
| three.core.js | 1,458,113 | 286,358 | 389,591 | 104,062 |
| three.module.js | 662,772 | 130,745 | 376,181 | 92,224 |
| gsap-core + CSSPlugin + Observer + ScrollTrigger + index | 376,373 | ~109,000 | 116,787 | ~48,000 |
| lenis.mjs | 33,166 | 8,236 | 18,714 | 5,446 |
| all of docs/vendor (script output) | ~2.7 MB | | **~0.94 MB (JS)** | **~257 KB gz (all JS together, one stream)** |

Raw copies are 2.4 MB of JS on the wire if the host did not compress; GitHub Pages does gzip JS/CSS/HTML, but **the local `python3 -m http.server` and Playwright tests do not**, so the `shoot.mjs` download-size number would show 2.4 MB for the raw vendor. **Recommendation: minify the vendor files** with esbuild (`MINIFY=1`, the script default): licence banners survive, GLSL template strings are untouched, and the page loads the same code (I ran the full import-map test with both variants). This leaves >2 MB of the ~3 MB budget for textures/fonts. (Add `esbuild` as a devDependency in package.json, or the script falls back to `npx --yes esbuild@0.28.2`.)

### 6.4 Working import map (tested in headless Chromium, SwiftShader WebGL2, **under a sub-path `/sub/path/` to mimic a GitHub Pages project site**)

```html
<link rel="stylesheet" href="./vendor/lenis/lenis.css">
<script type="importmap">
{ "imports": {
  "three":         "./vendor/three/three.module.js",
  "three/addons/": "./vendor/three/addons/",
  "gsap":          "./vendor/gsap/index.js",
  "gsap/":         "./vendor/gsap/",
  "lenis":         "./vendor/lenis/lenis.mjs"
} }
</script>
<script type="module">
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import Lenis from 'lenis';
</script>
```
- The import map must come **before** any module script and be inline or an external `<script type="importmap" src>`; relative values resolve against the page URL (inline map) so `./vendor/...` works at `/` and at `/aviva/` alike. `index.html` lives in `docs/`, so `./vendor` is right for it; a page in `docs/lab/` needs its own map with `../vendor/...`, or use root-relative paths only if the site is served from the domain root (not on a GitHub project page).
- Result of the test page (`work/scripts/importmap-test.mjs` + a scratch page): `THREE.REVISION "186"`, `WebGL 2.0`, EffectComposer with a 4x MSAA half-float target + OutputPass rendered, `GSAP 3.15.0`, `ScrollTrigger 3.15.0`, Lenis wheel scrolling moved `scrollY` 0 -> 1800 and a scrubbed ScrollTrigger tween reached 1.0. No console errors (only the favicon 404 of my scratch page).

### 6.5 Copy script

`work/scripts/copy-vendor.sh` (written and tested; web-developer runs `bash work/scripts/copy-vendor.sh` from the repo root after `npm install`; optional arg = destination, default `docs/vendor`; `MINIFY=0` for plain copies). It: copies and minifies three + chosen addons with their transitive imports (resolved by an inline node snippet, fails loudly on a missing/unresolved import), copies the five gsap ESM files, writes `gsap/LICENSE.txt`, copies lenis + css + LICENSE. Edit the `ADDONS=( ... )` array to add addons.

