# Razorpay webhook recovery

The webhook endpoint requires `RAZORPAY_WEBHOOK_SECRET`. This value is separate
from `RAZORPAY_KEY_SECRET` and must exactly match the secret configured for the
Razorpay webhook.

## Production recovery

1. Set the new production credentials in the backend environment:
   `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and
   `RAZORPAY_WEBHOOK_SECRET`.
2. Set `NEXT_PUBLIC_RAZORPAY_KEY_ID` in the frontend deployment environment to
   the same key ID used by the backend. Never add the API key secret or webhook
   secret to a `NEXT_PUBLIC_*` variable.
3. Configure the exact same webhook secret for the webhook at
   `https://backend.acubemart.in/api/payment/order/webhook` in Razorpay.
   Enable `payment.captured`, `order.paid`, and `payment.failed`.
4. Set `NODE_ENV=production` and restart the backend process with its updated
   environment.
5. Rebuild and deploy the frontend because `NEXT_PUBLIC_*` values are embedded
   at build time.
6. Confirm `GET /api/health/readiness` returns HTTP 200 with all checks `true`.
7. Re-enable the webhook, run one small live payment, and resend relevant failed
   captured/paid events from Razorpay.

Use live-mode keys and configure the webhook in Razorpay live mode. Deploy the
backend and rebuilt frontend close together so the checkout key ID never points
at a different key from the one used to create the Razorpay order.

There is no recurring polling worker. Recovery is event-driven through the
signed Razorpay webhook and the checkout verification/recovery endpoints. A
captured event persists the paid attempt and idempotently creates the order
before returning HTTP 200. If finalization has a transient failure, Razorpay
receives a non-2xx response and retries the event.
