# 02 — ORYZO reference teardown

Author: reference-analyst · Date: 2026-10-01 · Status: in progress (written section by section)

## Sources and reach (read first)
- **oryzo.ai is not reachable** from this VM (proxy 403 / ERR_TUNNEL_CONNECTION_FAILED, checked by the lead in Phase 0). No live capture, no DOM/`window` inspection, no asset list. Everything about libraries and canvas vs DOM below is **inferred from the frames**, and marked so.
- **blog.lusion.co (Oryzo BTS series) is not reachable** (curl and WebFetch blocked). Only WebSearch snippets were used; see §6.
- **Primary source:** `reference/VIDEO_NOTES.md` + all 84 frames in `reference/oryzo-frames/` (every frame opened and read). Frames are 1440×748 JPEGs scaled from a 1918×996 desktop screen recording.
- **Secondary:** `work/oryzo-1-repo/` (README, paper.pdf, checkpoint .obj headers) for the academic section's format.
- **Mobile:** the recording is desktop only. Everything about mobile is **inferred** and labelled as such.

### Frame geometry (how to read every number in this document)
- Browser chrome occupies frame rows 0–33. **The page viewport is frame rows 34–743: 1440 × 710 frame px** (aspect 2.03:1). In the original recording that is ≈ 1918 × 945 CSS px.
- Because the layout scales with viewport width, **1 frame px ≈ 1 CSS px on a 1440-wide viewport**. So px values below can be read as "px at 1440 wide". `1vw = 14.4 px`. For vertical values, `1vh = 7.10 frame px` in the recording; vh values are given against that.
- Positions use frame coordinates with the viewport's top at y=34 subtracted where a vh value is given (so "y=34" is 0 vh, "y=389" is the vertical centre, 50 vh).
- Our test viewport is 1440 × 900 (aspect 1.6), taller than the recording. Treat vw-based sizes (type, card widths) as reliable and vh-based ones (vertical placement) as proportions of the viewport.

---

## 1. Overview

**What it is.** ORYZO is Lusion's parody "AI product launch" for a cork coaster. One long, dark page treats a coaster like a flagship AI model and a luxury gadget at once: it has a model name (ORYZO-1), "powered by AI", wearable mode, thermal stability, encryption, a sustainability story, testimonials, a gallery of benchmark-style claims, three tiers (base / Pro / Pro Max), an academic paper with BibTeX and open weights (`.obj` files on GitHub), and a closing pitch for the studio.

**Personality in five adjectives:** deadpan, lavish, warm, self-aware, tactile.

**Why it works as a parody.**
1. **Craft is the punchline.** The site spends real effort (photoreal desk renders, a thermal pass, cork macros, a staged photo series) on an object worth almost nothing. The gap between effort and object is the joke, so the craft cannot be faked or cut.
2. **It borrows two launch languages at once:** Apple-style product theatre (giant type, slow product rotations, tier picker, comparison table) and AI-lab vocabulary (model name, temperature, tokens, edge inference, GPU memory, open weights, peer review, BibTeX). Every section maps a coaster's dull property onto one of those terms.
3. **Never winks visually.** The UI stays restrained and premium the whole way; the jokes live in the words, the footnotes and the staged photos. The one place the UI breaks its own rules (the magazine cover, a serif face) is a deliberate transition, not a gag.
4. **It is honest about being fake.** The footer states plainly that the product doesn't exist and nothing is for sale; the ending turns the whole thing into a portfolio pitch.

---

@@SCROLLMAP@@