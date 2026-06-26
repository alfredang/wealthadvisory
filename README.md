# Sterling & Vale Advisory

![Static Site](https://img.shields.io/badge/site-static_HTML-1e1033)
![GitHub Pages](https://img.shields.io/badge/deploy-GitHub_Pages-2ea44f)
![License](https://img.shields.io/badge/license-proprietary-c9a85f)

Long-term wealth management landing page for Sterling & Vale Advisory.

## Live Demo

[https://alfredang.github.io/wealthadvisory/](https://alfredang.github.io/wealthadvisory/)

## Screenshot

![Project home screen](screenshot.png)

## About

This is a responsive static website for a fiduciary wealth advisory brand. It presents services, testimonials, a complimentary Wealth Health Check enquiry form, and a WhatsApp chat widget.

## Features

- Responsive one-page landing site
- Wealth advisory service sections
- Testimonial carousel
- Client enquiry form with validation
- Floating WhatsApp chat widget
- SEO metadata, Open Graph tags, and structured data
- GitHub Pages deployment workflow

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- GitHub Pages

## Architecture

The project is a plain static site. `index.html` defines the content and structure, `styles.css` handles layout and responsive styling, and `script.js` handles interactions such as navigation, carousel behavior, form validation, and WhatsApp launcher behavior.

## Project Structure

```text
.
├── .github/workflows/deploy-pages.yml
├── .gitignore
├── README.md
├── index.html
├── screenshot.png
├── script.js
└── styles.css
```

## Getting Started

Run a local static server from the project root:

```bash
python3 -m http.server 8081
```

Open [http://127.0.0.1:8081/](http://127.0.0.1:8081/).

## Deployment

The repository includes a GitHub Actions workflow that deploys the root static site to GitHub Pages after pushes to `main`.

## Enquiry Form

The contact form submits through FormSubmit's AJAX endpoint in `script.js`. The current endpoint uses `angch@tertiaryinfotech.com`. If that address changes, FormSubmit requires a one-time activation email confirmation before submissions are delivered.

The form includes a hidden honeypot field and sends FormSubmit helper fields for table formatting, captcha disabling, and a custom subject line.

## Credits

Powered by [Tertiary Infotech Academy Pte Ltd](https://www.tertiaryinfotech.com/).
