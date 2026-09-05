# Google Play review access

Use one dedicated account and one reusable six-digit code for Google Play
review. The exception is checked on the backend and only applies to the exact
configured phone number. It does not send an SMS and it never accepts the code
for another customer.

## Configure the backend

Set these variables in the production backend environment (AWS), not in the
frontend or Android app:

```text
PLAY_REVIEW_ENABLED=true
PLAY_REVIEW_COUNTRY_CODE=91
PLAY_REVIEW_PHONE=<dedicated 10-digit Indian phone number>
PLAY_REVIEW_OTP=<dedicated reusable 6-digit code>
PLAY_REVIEW_NAME=Google Play Reviewer
PLAY_REVIEW_EMAIL=<dedicated reviewer email address>
```

Do not commit the real number or code. Do not put either value in a
`NEXT_PUBLIC_*` variable. Choose a number that is not assigned to a real
customer and a code that is not used anywhere else.

With the same environment loaded, create or repair the test account once:

```bash
npm run setup:play-review-user
```

Then restart the backend. Startup should report that Google Play review access
is enabled. Test the complete flow in a private browser before submitting:

1. Open the login screen.
2. Enter the configured 10-digit phone number and tap **Send OTP**.
3. Enter the configured reusable code and sign in.
4. Add a product to cart and proceed through checkout.
5. Use the same phone number and reusable code if checkout asks for OTP again.

The normal signed-in session remains managed by NextAuth. If the reviewer
clears app data, changes devices, or the session expires, the same credentials
can be used again.

## Play Console access instructions

Use this structure in **App access**:

```text
Username / phone number: +91<PLAY_REVIEW_PHONE>
Password: <PLAY_REVIEW_OTP>

Open the app and go to Account / Login. In the phone field, enter the final
10 digits of the phone number shown above (without +91), then tap "Send OTP".
No SMS is sent for this dedicated review account. Enter the reusable password
shown above as the OTP. The same code can be reused at checkout if phone
verification is requested. The account is not location-dependent and does not
expire during the review period.
```

Keep `PLAY_REVIEW_ENABLED=true` while a release is under review or may be
re-reviewed. Disable it and restart the backend when review access is no longer
needed. Re-enable the same account before every future submission.
