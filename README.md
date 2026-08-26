# Harvest Bridge — Food Export Platform

A full-stack website for a food export merchant who lists products (their own and partner companies') and collects buyer inquiries. Everything on the public site is managed from an admin panel — there is no public sign-up.

- **Frontend:** React 18 + Vite + Tailwind CSS + React Router
- **Backend:** Node.js + Express + MongoDB (Mongoose), JWT auth, Multer uploads, Nodemailer
- **Inquiries:** saved to the database *and* emailed to your sales inbox

The seed brand is "Harvest Bridge" — change it in one file (`client/src/config.js`) to rebrand.

---

## Project structure

```
food-export-platform/
├── server/            Express API
│   ├── server.js
│   └── src/
│       ├── config/       db connection
│       ├── models/       User, Segment, Partner, Product, Inquiry, Brochure
│       ├── controllers/  request handlers
│       ├── routes/       public GET + protected write routes
│       ├── middleware/    auth (JWT), errors, file upload
│       ├── utils/        email sender
│       └── seed/         demo data + admin user
├── client/            React app
│   └── src/
│       ├── pages/         public pages + pages/admin (CMS)
│       ├── components/    shared UI + components/admin
│       ├── context/       auth context
│       ├── api/           axios instance
│       └── config.js      brand settings (rebrand here)
└── package.json       convenience scripts to run both
```

---

## Prerequisites

- Node.js 18+ and npm
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas connection string

---

## Setup

**1. Install dependencies** (server and client)

```bash
# from the project root
npm run install:all
# or individually:
#   cd server && npm install
#   cd client && npm install
```

**2. Configure the server environment**

```bash
cd server
cp .env.example .env
```

Open `server/.env` and set at least:

- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the admin login the seed will create

Email is optional. Leave the `SMTP_*` values blank and inquiries are still saved — the notification is just logged to the server console. To actually send mail, fill in your SMTP host, user, and password, and set `INQUIRY_NOTIFY_TO` to the inbox that should receive inquiries.

**3. (Optional) Configure the client environment**

The client works with no config in development thanks to Vite's dev proxy. If you deploy the API to a different origin, create `client/.env` from `client/.env.example` and set `VITE_API_URL` to the API's base URL.

**4. Seed demo data + the admin user**

```bash
# from the project root
npm run seed
# or: cd server && npm run seed
```

This creates the admin user and a set of sample segments, partners, products, and brochures.

---

## Running

Two terminals (recommended while developing):

```bash
# terminal 1 — API on http://localhost:5000
npm run dev:server

# terminal 2 — site on http://localhost:5173
npm run dev:client
```

Or both at once from the root (installs `concurrently` with `npm install` at the root first):

```bash
npm install      # root, for concurrently
npm run dev
```

- Public site: <http://localhost:5173>
- Admin panel: <http://localhost:5173/admin/login>

Sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `server/.env` (defaults: `admin@harvestbridge.com` / `admin12345`). **Change these before deploying.**

---

## What the admin can do

- **Segments** — product categories (Spices, Grains, etc.), shown across the site
- **Partners** — collaborating companies whose products you list
- **Products** — full catalogue entries: images, origin, HS code, packaging, MOQ, certifications, featured flag, and visibility toggle
- **Brochures** — upload PDF catalogues / line cards for buyers to download
- **Inquiries** — read messages from the inquiry form, mark them new / read / responded, reply by email, or delete

Images can be uploaded (stored in `server/uploads/`) or pasted in as URLs. Uploaded files are served from `/uploads`.

---

## Rebranding

Edit `client/src/config.js` for name, tagline, contact details. Colors and fonts live in `client/tailwind.config.js` and `client/index.html` (Google Fonts). The favicon is `client/public/favicon.svg`.

---

## API reference (brief)

Public: `GET /api/segments`, `GET /api/segments/:slug`, `GET /api/products` (supports `segment`, `partner`, `featured`, `search`, `page`, `limit`), `GET /api/products/:slug`, `GET /api/partners`, `GET /api/partners/:slug`, `GET /api/brochures`, `POST /api/inquiries`.

Auth: `POST /api/auth/login`, `GET /api/auth/me`.

Protected (Bearer token): create/update/delete for segments, products, partners, brochures; `GET /api/inquiries`, `PATCH /api/inquiries/:id`, `DELETE /api/inquiries/:id`; `POST /api/upload` (image).

---

## Production notes

- Set `NODE_ENV=production` and a strong `JWT_SECRET` on the server.
- Build the client with `npm --prefix client run build` and serve `client/dist` from any static host (or from Express).
- Point `CLIENT_URL` (server) at your deployed frontend origin for CORS, and `VITE_API_URL` (client) at your deployed API.
- Consider moving uploaded files to object storage (e.g. S3) if you deploy to a platform with an ephemeral filesystem.
