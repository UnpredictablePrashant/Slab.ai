# Slab.ai Web Frontend

This package hosts the production frontend for Slab.ai. It replaces the static template/testing pages with a fully responsive React + TypeScript application that talks to each backend service through environment-driven URLs. The UI focuses on discoverability (domain filters, search, sub-project previews) and on completing the purchase flow end-to-end with Razorpay.

## Quick start

```bash
cd frontend
cp .env.example .env           # update the values before running
npm install
npm run dev                    # http://localhost:5173
```

### Required environment variables

| Name | Description |
| --- | --- |
| `VITE_PROJECT_SERVICE_URL` | Base URL where the Project Service is running (`http://localhost:3002`). |
| `VITE_PAYMENT_SERVICE_URL` | Base URL for the Payment Service (`http://localhost:3003`). |
| `VITE_USER_SERVICE_URL` | Base URL for the User Lead Service (`http://localhost:3001`). |
| `VITE_RAZORPAY_KEY_ID` | Public Razorpay key used on the checkout widget. |

> Do not commit your filled `.env`. All values are read via `import.meta.env` so nothing is hard-coded.

### Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Starts Vite with hot module reloading. |
| `npm run build` | Type-checks and produces an optimized production bundle. |
| `npm run preview` | Serves the production bundle locally. |
| `npm run lint` | ESLint across the project. |

## Architecture highlights

- **React + TypeScript + Vite** for componentized UI and fast builds.
- **Config-driven services** via `src/config/env.ts`, which validates and exposes project, payment, and user service URLs plus the Razorpay key.
- **API helpers** in `src/lib/api.ts` centralize fetch logic, error handling, and shared payload types.
- **Feature-led sections**: hero + stats, smart filters, live project grid, testimonial marquee, CTA strips, and contextual forms for lead capture and download link requests.
- **Checkout sheet** encapsulates the Razorpay flow (order creation, hosted checkout, verification, and success messaging) without leaking secrets into the browser bundle.
- **Design tokens** in `src/index.css` keep colors, typography, and spacing consistent while remaining framework-agnostic.

See inline comments across `src/components` and `src/hooks` for implementation details.
