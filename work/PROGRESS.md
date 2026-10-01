# aviva — PROGRESS

If you lose context: `git pull`, then read this file and `work/decisions.md`, and carry on from "Next step".

Branch: `claude/elegant-curie-dduigw` → PR into `main` (user merges).

## Environment (checked 2026-10-01, Phase 0)
| Resource | Reachable? | Notes |
|---|---|---|
| https://oryzo.ai (live site) | **No** (proxy 403 / ERR_TUNNEL_CONNECTION_FAILED) | Team works from `reference/VIDEO_NOTES.md` + 84 frames in `reference/oryzo-frames/`. |
| https://blog.lusion.co (Oryzo BTS series) | **No** (egress blocked, curl + WebFetch) | Use WebSearch snippets only; say so in reports. |
| github.com / raw.githubusercontent.com | Yes | `lusionltd/ORYZO-1` cloned to `work/oryzo-1-repo/` (git-ignored, read only). three.js / gsap / lenis source + examples readable on GitHub. |
| api.github.com via curl | No (403) | Use the GitHub MCP tools for PRs. |
| npm registry | Yes | three 0.186.1, gsap 3.15.0, lenis 1.3.26 (latest on 2026-10-01). |
| Google Fonts (fonts.googleapis.com + fonts.gstatic.com) | Yes | Font files can be self-hosted in `docs/assets/fonts/`. |
| WebSearch | Yes | Returns result snippets/titles; most target sites are blocked for WebFetch. |
| WebFetch (wikipedia, threejs.org, …) | **Mostly no** | Egress proxy blocks most hosts. Researchers rely on WebSearch + GitHub-hosted sources + node_modules docs. |
| Local tooling | Yes | `npm install` done; `npm run serve` on :8080; `tools/shoot.mjs` works with software WebGL (SwiftShader). |

## Phase checklist
- [x] **Phase 0 — Setup**: mission saved, folders, npm install, shoot tool verified, network checked, ORYZO-1 repo cloned, commit + push, draft PR (#1).
- [x] **Phase 1 — Discovery**: reference teardown (reference-analyst), paper + parody research (web-researcher A), tech research (web-researcher B). Lead reviews all three.
- [ ] **Phase 2 — Concepts**: 3 concepts (creative-director), lead scores + chooses.
- [ ] **Phase 3 — Brief, look-dev, skeleton**: creative brief; then in parallel design system + paper look-dev, technical skeleton, fact-check. Lead iterates paper look until it's clearly real.
- [ ] **Phase 4 — Build**: sections in chunks, screenshots between chunks.
- [ ] **Phase 5 — Review loops** (3–6 rounds): fidelity + similarity, creative, visual → fix list → fixes.
- [ ] **Phase 6 — Final QA + hand-over**: QA run, README, CREDITS, LICENSE, `git rm -r reference`, PR ready.

## Log
- 2026-10-01 — Phase 0 done. Placeholder `docs/index.html`; `docs/.nojekyll`; `work/reviews/`. Draft PR: https://github.com/RelentlessYunn/aviva/pull/1
- 2026-10-01 — Pinned three 0.186.1 / gsap 3.15.0 / lenis 1.3.26 as devDependencies (exact). Phase 1 launched.
- 2026-10-01 19:12 UTC — All three Phase 1 agents hit an API usage limit before writing anything; resumed after the reset with their context intact, and told to write their files incrementally.
- 2026-10-01 — Research A accepted (sourced, confidence-tagged). Teardown accepted (measured 63 vh scroll map, 54 signature elements, 48-item checklist). Collision decisions #7–#10 logged (no fold-to-encrypt, no blank-A4 weights, no power-draw card, no Pro Max/glowing pills). Concepts brief sent.
- 2026-10-01 — Tech research accepted, with a working prototype in `work/scripts/paper-proto/` (folds, dart plane, halving, tear, crumple, pencil, ink front, picking, contact shadow) and a tested import map + `work/scripts/copy-vendor.sh`. Look-dev targets logged (#12). **Phase 1 complete.**

## Running now
- creative-director → `work/03-concepts.md` (Phase 2 started early, in parallel with tech research)

## Next step
- Review 3 concepts, score on 5 criteria, choose, log in decisions.md. Then Phase 3 brief.
