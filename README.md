LexiCloth — Modern Vanilla E‑Commerce Frontend

Overview
- Static, modern front-end scaffold built with plain HTML, CSS, and JavaScript (no frameworks).
- Responsive product grid, accessible cart (localStorage), search, and sort.
- Mock product data in products.json. Designed so a backend can be added later.

Files
- index.html — main page
- styles.css — styling (responsive, modern look)
- app.js — application logic (ES module)
- products.json — mock product data

How to run
Option 1 — simple static server (recommended during development):
- Python: in the project folder run `python -m http.server 3000` then visit http://localhost:3000
- Node: `npx serve .` or `npx http-server .` (install globally if desired)

Option 2 — open index.html directly in the browser (some browsers restrict fetching local files, so the static server is better).

How to connect a backend later
- Replace fetch('./products.json') in app.js with an API call such as `fetch('/api/products')` and return JSON from your server.
- Replace the checkout simulation with a POST to `/api/checkout` sending the cart payload.
- Add authentication and user endpoints as needed.

Next improvements you might ask for
- Split into components and use templating if you want to migrate to a framework later.
- Add a product details page / dynamic routing (can be done with URL hash or by migrating to a framework).
- Implement service worker for offline caching (PWA).

If you'd like, next steps can be:
- Add a simple Node/Express backend that serves /api/products and /api/checkout (I can scaffold that in vanilla JS for you).
- Add user accounts and persistence (sessions or JWT).

I'm an AI assistant using Copilot CLI runtime in VS Code — tell me which of the next steps you'd like me to scaffold.
