This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Abuse Protection and Alerts

API routes include per-IP rate limiting, input validation, structured request logging, and optional webhook alerts.

Optional environment variables:

- `ALERT_WEBHOOK_URL`: HTTPS endpoint to receive JSON alerts for traffic spikes and error bursts.
- `TRAFFIC_SPIKE_THRESHOLD`: Requests per minute per route before a traffic alert. Default `120`.
- `ERROR_BURST_THRESHOLD`: Error count (`429` or `5xx`) over 5 minutes per route before an alert. Default `20`.
- `ALERT_COOLDOWN_SECONDS`: Alert cooldown per route+type. Default `300`.
- `SMTP_HOST`: SMTP server hostname (Fastmail: `smtp.fastmail.com`).
- `SMTP_PORT`: SMTP port (Fastmail commonly `465`).
- `SMTP_SECURE`: `true` for SSL/TLS (default `true`).
- `SMTP_USER`: SMTP username (usually your full email address).
- `SMTP_PASS`: SMTP app password.
- `ALERT_EMAIL_TO`: Destination email for alerts.
- `ALERT_EMAIL_FROM`: Sender email for alerts (defaults to `SMTP_USER`).
- `ALERT_EMAIL_SUBJECT_PREFIX`: Prefix for email subject lines (default `[PrintStarter Alert]`).
- `ALERT_TEST_TOKEN`: Secret token required for manual test alert endpoint.
- `NEXT_PUBLIC_GA_ID`: Google Analytics Measurement ID (for example `G-XXXXXXXXXX`).

Manual test endpoint:

- `POST /api/test-alert`
- Provide token via header `x-alert-test-token` (or JSON body `{ "token": "..." }`)
- Example:
  - `curl -X POST http://localhost:3000/api/test-alert -H "x-alert-test-token: YOUR_TOKEN"`

## Analytics Events

When `NEXT_PUBLIC_GA_ID` is set, Google Analytics is loaded and these events are emitted:

- `landing_header_get_started_click`
- `landing_hero_start_generating_click`
- `generate_form_submitted`
- `generate_request_started`
- `generate_request_succeeded`
- `generate_request_failed`
- `random_prompt_requested`
- `random_prompt_loaded`

Analytics consent:

- A consent banner is shown before analytics starts.
- GA loads only after user clicks `Accept`.
- Consent is stored in `localStorage` key `analytics-consent`.
