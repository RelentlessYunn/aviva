# aviva — decisions log

One line per decision: what, and why.

| # | Date | Decision | Why |
|---|---|---|---|
| 1 | 2026-10-01 | Work from `reference/` (VIDEO_NOTES + 84 frames) as the primary ORYZO source; no live-site capture. | oryzo.ai and blog.lusion.co are blocked by this environment's network policy (proxy 403). The user said to trust the frames anyway. |
| 2 | 2026-10-01 | ORYZO-1 GitHub repo cloned to `work/oryzo-1-repo/` and git-ignored. | Read-only study of the academic-section *format*; nothing from it is shipped or committed. |
| 3 | 2026-10-01 | Pin three 0.186.1, gsap 3.15.0, lenis 1.3.26 (latest on npm today). | Current stable versions; self-hosted in `docs/vendor/` per CLAUDE.md rule 3. |
| 4 | 2026-10-01 | Open the PR with the GitHub MCP tools rather than `gh`. | `gh`/api.github.com isn't usable from this VM; the MCP server is the supported route. |
| 5 | 2026-10-01 | Accept `work/01-research.md` (Task A) as the fact source, with its confidence tags binding: `low` items never ship as facts; derived numbers get re-checked in the brief fact-check. | Thorough and honest; most hosts were blocked, so snippets + confidence tags are the best available evidence. |
| 6 | 2026-10-01 | Accept `work/02-reference-teardown.md`; its §8 signature list (54 items) and §9 checklist (48 items) are binding for all reviews. | Measured scroll lengths (63 vh total) and sizes make it buildable; the similarity list protects us. |
| 7 | 2026-10-01 | **Drop "fold-to-encrypt"** (mission row 10) as the interactive gimmick; the creative team must invent a different input-driven gimmick. | Same joke and interaction structure as ORYZO's flip encryption + engraved text (teardown §8 #10, #36). The similarity audit beats everything. |
| 8 | 2026-10-01 | **No "blank A4 PDF as model weights" gag.** Our parody paper is a real multi-page paper with its own jokes. | Verified: ORYZO-1's `paper.pdf` is a one-page A4 PDF reading "ORYZO-1 on A4 Paper" (teardown §8 #50). |
| 9 | 2026-10-01 | **No "power draw: 0 W" card, no "sustainability" giant word, no power/uptime claims** ("No battery. No updates." must be reworked). | ORYZO's third sustainability card is "power draw while in use"; "always on / no power required" is their claim card (§8 #14, #39, #40). |
| 10 | 2026-10-01 | Avoid the exact "Pro Max" suffix and three glowing pills in the tier picker; the loader uses blueprint dimension lines/crop marks, never bezier handles, dashed double outline or conic fill; no drawing↔object match-cut repeated mid-page. | Teardown collision table (medium risks); keep the technique, change the execution. |
