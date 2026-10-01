# aviva — decisions log

One line per decision: what, and why.

| # | Date | Decision | Why |
|---|---|---|---|
| 1 | 2026-10-01 | Work from `reference/` (VIDEO_NOTES + 84 frames) as the primary ORYZO source; no live-site capture. | oryzo.ai and blog.lusion.co are blocked by this environment's network policy (proxy 403). The user said to trust the frames anyway. |
| 2 | 2026-10-01 | ORYZO-1 GitHub repo cloned to `work/oryzo-1-repo/` and git-ignored. | Read-only study of the academic-section *format*; nothing from it is shipped or committed. |
| 3 | 2026-10-01 | Pin three 0.186.1, gsap 3.15.0, lenis 1.3.26 (latest on npm today). | Current stable versions; self-hosted in `docs/vendor/` per CLAUDE.md rule 3. |
| 4 | 2026-10-01 | Open the PR with the GitHub MCP tools rather than `gh`. | `gh`/api.github.com isn't usable from this VM; the MCP server is the supported route. |
