# meenaya-2 — local site

A self-contained local copy of the `meenaya-2` wedding-invite template (originally built with Framer),
with a custom GSAP parallax layer added.

## Run it

The site uses ES modules and root-relative paths, so it must be served over HTTP (not opened as a file):

```bash
cd E:/Project/website
python -m http.server 8780            # then open http://localhost:8780
# add --bind 0.0.0.0 to reach it from other devices on your network
```

## Structure

```
website/
├── index.html              # page markup (Framer export) + asset/script references
├── css/                    # styles extracted out of index.html
│   ├── fonts.css           #   @font-face declarations
│   ├── breakpoints.css     #   responsive breakpoint rules
│   └── framer.css          #   component / layout styles (server-rendered CSS)
├── js/
│   ├── parallax.js         # ← custom GSAP scroll parallax (the only hand-written logic)
│   ├── vendor/             #   third-party libraries
│   │   ├── gsap.min.js
│   │   └── ScrollTrigger.min.js
│   └── framer/             #   Framer runtime helpers, extracted from index.html
│       ├── links.js        #     external/download link handling
│       ├── variants.js     #     ?variant query handling
│       ├── animator.js     #     appear-animation engine (defines window.animator)
│       └── env.js          #     NODE_ENV shim
├── framerusercontent.com/  # mirrored images, fonts, and Framer JS modules (.mjs)
└── fonts.gstatic.com/      # mirrored Google Fonts
```

## Notes

- **What was hand-cleaned:** the large inline `<style>` and helper `<script>` blocks were pulled out of
  `index.html` into the `css/` and `js/` folders above (462 KB → ~285 KB of HTML). The DOM markup itself
  is Framer-generated output and is left as-is — rewriting it by hand would mean rebuilding the site.
- **Kept inline on purpose:** the `type="framer/appear"` data blocks, the `data-framer-appear-animation`
  script, and the `application/ld+json` block. Framer reads these from the DOM by id/type, so moving them
  would break hydration.
- **Parallax:** `js/parallax.js` adds a restrained scroll parallax to feature/background images only
  (gallery grids and small decoratives are deliberately skipped). Respects `prefers-reduced-motion`.
- **Branding:** images and copy still belong to the original "Missing Piece" template — replace them with
  your own/licensed assets before any real use.
- `index.html.bak` is the pre-refactor backup; safe to delete once you're happy with everything.
```
