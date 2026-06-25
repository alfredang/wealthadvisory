# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page marketing website for a fictional wealth-management firm, **Sterling & Vale Advisory**. Pure static site — **vanilla HTML, CSS, and JavaScript only**. No frameworks, no build tools, no package manager, no tests. The only external dependency is Google Fonts (Playfair Display + Inter). Keep it that way: do not introduce npm, bundlers, or JS/CSS libraries.

## Running

There is no build step. Open `index.html` directly in a browser. For features that prefer an HTTP origin (`fetch`, smooth scroll), serve the folder:

```
python -m http.server 8000   # then open http://localhost:8000
```

## File layout

- `index.html` — all markup/content; one page, anchor-linked sections (`#home`, `#services`, `#testimonials`, `#contact`)
- `styles.css` — all styling
- `script.js` — all interactivity, wrapped in a single `DOMContentLoaded` handler
- `README.md` — user-facing run + FormSubmit setup notes

## Architecture notes

- **Theming via CSS custom properties.** All colors, spacing (`--space-1..6`), layout, and type live in `:root` in `styles.css`. Change design tokens there, not inline. Palette is deep navy/slate + muted gold accent on off-white; tone is "premium/calm, not flashy" — avoid bright colors or hype copy.
- **Mobile-first + reveal pattern.** CSS is mobile-first with `min-width` breakpoints at 600/768/980px (plus a `max-width: 767px` block for the mobile nav). Elements with class `reveal` start hidden and get `.in-view` added by an IntersectionObserver for scroll-in animation. Add `reveal` to new sections to match. All animation respects `prefers-reduced-motion`.
- **`script.js` is six self-contained modules** inside `DOMContentLoaded`: mobile nav toggle, sticky-header shadow, offset smooth-scroll for `a[href^="#"]` (corrects for the sticky header height), IntersectionObserver reveals, the testimonial carousel (IIFE; auto-rotate + prev/next + dots, pauses on hover/focus), and the enquiry form. Wire new behavior as another module in the same handler.

## The enquiry form (the one piece of real logic)

Submits via **FormSubmit's AJAX endpoint** with `fetch()` (no page redirect). Flow: client-side validate (required fields + email regex) → POST JSON → on success replace form with inline thank-you, on error show inline message and re-enable the button.

- Endpoint is in `script.js`, marked `// REPLACE_WITH_YOUR_EMAIL` (currently `angch@tertiaryinfotech.com`).
- JSON body must keep the FormSubmit helper fields: `_subject`, `_template: "table"`, `_captcha: "false"`.
- Hidden `_honey` honeypot field; if filled, the submit silently "succeeds" without sending.
- **Activation gotcha:** FormSubmit requires a one-time email activation per new address — submissions don't deliver until the confirmation link is clicked. Note this whenever the endpoint email changes.

All content (firm name, stats, testimonials) is fictional placeholder data.
