# Om Sai Hospital Website

A public-facing hospital website built for **Om Sai Hospital**, highlighting general surgery and gynecology services, doctor profiles, facilities, and ways for patients to get in touch or book appointments.

## Tech stack

This project is a **static website** with no build step or backend server required so far:

| Layer | Technology |
|-------|------------|
| Markup | [HTML5](https://developer.mozilla.org/en-US/docs/Web/HTML) — semantic sections, accessibility attributes, SEO meta tags |
| Styling | [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS) — custom design system with CSS variables, responsive layout, and component styles (`styles.css`) |
| Scripting | [Vanilla JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) — navigation, modals, form handling, and UI interactions (`script.js`) |
| Typography | [Google Fonts](https://fonts.google.com/) — Inter (body) and Playfair Display (headings) |
| Icons | Inline SVG |
| Appointments | [WhatsApp](https://www.whatsapp.com/) deep links (`wa.me`) for booking and inquiries |
| Design reference | `hospital_website_design.json` — content and layout specification used to guide the build |

There is no framework (React, Vue, etc.), package manager, or CMS in use yet—the site runs entirely in the browser from static files.

## Project structure

```
om-hospital-website/
├── index.html                    # Main landing page
├── styles.css                    # Global styles and design tokens
├── script.js                     # Client-side behavior and WhatsApp integration
├── hospital_website_design.json  # Design/content blueprint
└── README.md
```

## Running locally

Open `index.html` in a browser, or serve the folder with any static file server, for example:

```bash
# Python 3
python -m http.server 8000

# Node (if npx is available)
npx serve .
```

Then visit `http://localhost:8000` (port may vary).


## License

Private project for Om Sai Hospital. All rights reserved unless otherwise specified by the hospital.
