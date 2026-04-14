# Deployment Guide for **writespace**

This document outlines the steps and requirements for deploying the **writespace** application, including environment variables, Vercel configuration, and special notes for Single Page Application (SPA) routing.

---

## 1. Build & Deploy

**writespace** is a Vite + React 18+ application. You can deploy it to any static hosting provider (e.g., Vercel, Netlify, GitHub Pages) that supports static site hosting.

### Local Build

```sh
npm install
npm run build
```

The production-ready static files will be in the `dist/` directory.

---

## 2. Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the client code.

**Example (`.env`):**
```
VITE_API_URL=https://api.example.com
VITE_APP_NAME=WriteSpace
```

**Usage in code:**
```ts
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 3. Vercel Configuration

To deploy on [Vercel](https://vercel.com):

- **Framework Preset:** Select "Vite"
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install` (default)
- **Environment Variables:** Add all required `VITE_` variables in the Vercel dashboard

### SPA Routing on Vercel

To support client-side routing (React Router), add a `vercel.json` file at the project root:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

This ensures all routes serve `index.html`, allowing React Router to handle navigation.

---

## 4. SPA Routing Notes

- **Static hosts** (Vercel, Netlify, etc.) must rewrite all unknown routes to `/index.html` for SPA routing to work.
- For **Netlify**, add a `_redirects` file in `public/`:
  ```
  /*    /index.html   200
  ```
- For **GitHub Pages**, set `"homepage"` in `package.json` and use `HashRouter` or configure your server accordingly.

---

## 5. Troubleshooting

- **404s on refresh:** Ensure SPA rewrites are configured (see above).
- **Environment variables not available:** Only variables prefixed with `VITE_` are exposed to the client.
- **Build errors:** Check Node.js and npm versions match project requirements.

---

## 6. Useful Commands

- `npm run dev` — Start local development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build locally

---

For further questions, check the [Vite documentation](https://vitejs.dev/guide/static-deploy.html) or your hosting provider's docs.