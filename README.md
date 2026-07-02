# Swad Ki Dukaan — Frontend

Customer-facing ordering web app. Vite + React (JavaScript). Static bundle, deploys to Cloudflare Pages.

## Run locally

```bash
npm install
cp .env.example .env       # edit values if needed
npm run dev                # http://localhost:5173
```

## Production build

```bash
npm run build              # outputs to dist/
npm run preview            # serve dist locally
```

## Environment

| Variable                    | Purpose                                            | Default                 |
| --------------------------- | -------------------------------------------------- | ----------------------- |
| `VITE_API_BASE_URL`         | Backend root                                       | `http://localhost:8000` |
| `VITE_APP_SIGNATURE_SECRET` | HMAC-SHA256 key for `X-App-Signature` header       | (required)              |

## Flow

Menu → Cart drawer → Checkout (phone + address + optional GPS) → OTP → Confirmation.

State machine in `src/App.jsx`. Cart lives in app state; checkout hands a snapshot forward to OTP and confirmation screens.

## API

- `POST {API_BASE}/api/orders/send-otp/`
- `POST {API_BASE}/api/orders/verify-otp/`

Every request sends:

- `Content-Type: application/json`
- `X-Client-Timestamp` — unix seconds, string
- `X-App-Signature` — HMAC-SHA256 hex of timestamp, key = `VITE_APP_SIGNATURE_SECRET`

Signing logic in `src/api.js` uses Web Crypto `crypto.subtle` (async, runs in the browser).

Error handling: 400 surfaces the backend's `error` field inline; 429 → "Too many attempts, wait a minute"; OTP mismatch 400 → "That code didn't match."

In local DEBUG the backend may bypass signature verification — the app still sends the header, backend ignores if bypassed.

## Deploy to Cloudflare Pages

- Build command: `npm run build`
- Build output: `dist`
- Env vars: add `VITE_API_BASE_URL` and `VITE_APP_SIGNATURE_SECRET` in Pages → Settings → Environment variables.

## Layout

```
src/
  main.jsx               entry
  App.jsx                step state + cart state
  api.js                 signed fetch helpers
  styles.css             palette + layout
  data/menu.js           sample dishes
  components/
    TopBar.jsx
    Menu.jsx
    CartDrawer.jsx
    Checkout.jsx
    OtpScreen.jsx
    Confirmation.jsx
```

## Design notes

Palette derives from the wordmark — deep maroon primary, gold for price and active states, warm cream background, charcoal text. Playfair Display for the wordmark and headings, Inter for body. No dark theme, no purple/blue gradients, no glassmorphism, no decorative emoji.