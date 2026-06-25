# Sterling & Vale Advisory — One-Page Website

A polished, responsive one-page investment advisory site built with **vanilla HTML, CSS, and JavaScript** — no frameworks, no build tools. The only external dependency is Google Fonts (Playfair Display + Inter).

🔗 **Live site:** https://alfredang.github.io/wealthadvisory/

## Files
- `index.html` — markup and content
- `styles.css` — mobile-first styling, themed via `:root` custom properties
- `script.js` — nav, smooth scroll, scroll-in animations, testimonial carousel, form handling
- `.github/workflows/deploy.yml` — GitHub Actions workflow that deploys to GitHub Pages
- `README.md` — this file

## Run / test locally
No server or build step is required:

1. Double-click `index.html` (or right-click → Open With → your browser).
2. Check: sticky nav, smooth-scrolling anchors, hero "Book a Consultation" jumps to the form, the testimonial carousel auto-rotates with working prev/next + dots, and sections fade in on scroll.
3. Resize the window to ~375px / ~768px / ~1280px to confirm the hamburger menu, card stacking, and overall responsiveness.
4. Open DevTools → Console to confirm there are no errors.

> Tip: a couple of features (smooth scrolling, fetch) behave most reliably when served over `http://` rather than `file://`. If you want that, run a quick static server from this folder:
> ```
> python -m http.server 8000
> ```
> then open http://localhost:8000

## Deployment
The site auto-deploys to **GitHub Pages** via GitHub Actions. Every push to the `main` branch triggers the `Deploy to GitHub Pages` workflow, which publishes the repo root. You can also trigger it manually from the **Actions** tab → "Run workflow".

## The enquiry form (FormSubmit)
The form submits via **FormSubmit's AJAX endpoint** using `fetch()`, so the page never redirects. On success the form is replaced with an inline thank-you message; on error it shows an inline error and re-enables the button.

### Set your email
In `script.js`, find the line marked `// REPLACE_WITH_YOUR_EMAIL`:

```js
const ENDPOINT = "https://formsubmit.co/ajax/angch@tertiaryinfotech.com";
```

It is currently set to **angch@tertiaryinfotech.com**. Swap in any address you want enquiries delivered to.

### ⚠️ One-time activation (required)
FormSubmit requires a **one-time activation** the first time you submit to a new email address:

1. Submit the form once from the page.
2. FormSubmit sends a confirmation email to the address above.
3. Click the activation link in that email.
4. After that, all future submissions are delivered automatically.

Until you click the activation link, submissions will **not** arrive in your inbox.

### Spam protection
A hidden honeypot field (`_honey`) is included and hidden via CSS. Bots that fill it are silently ignored. The form also sends `_captcha: "false"`, `_template: "table"`, and a custom `_subject` to FormSubmit.

## Notes
- Disclaimer in the footer: *"This website is for informational purposes only and does not constitute financial advice."*
- All firm details, stats, and testimonials are fictional placeholders — update them as needed.
- Animations respect `prefers-reduced-motion`.
