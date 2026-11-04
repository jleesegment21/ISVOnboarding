# ISV Messaging Onboarding Guide

A static, self-contained walkthrough of **messaging compliance and onboarding** for Twilio ISV customers (voice is covered briefly). It covers account and subaccount architecture, sender and number types, compliance (US, Canada and international, including the Compliance Embeddable), and fraud and security. Every chapter links to the official Twilio docs it draws on. The visual theme matches the NurseShiftRelay ConversationRelay Lab.

## Run locally

```bash
cd ISVOnboarding
python3 -m http.server 8080   # then open http://localhost:8080
```

You can also open `isv-messaging-onboarding.html` directly. There's no build step and no dependencies.

## Host it

Upload the folder as-is to any static host, such as GitHub Pages, Netlify drop, Cloudflare Pages, S3 or Twilio Assets. Only `isv-messaging-onboarding.html`, `index.html`, `css/` and `js/` are needed. `index.html` just forwards the bare site URL to the guide, keeping any `?customer=` and `#chapter`.

## Presenting

| Feature | How |
|---|---|
| Personalise for a customer | `…/isv-messaging-onboarding.html?customer=Acme%20Health` shows "Prepared for Acme Health" |
| Deep-link a chapter | `#start`, `#architecture`, `#senders`, `#compliance/us`, `#compliance/ca`, `#compliance/intl`, `#fraud`, `#errors/30034`, `#faq` |
| Navigate | ← → keys, chapter bar, or Back/Next |
| Overview vs Deep dive | Toggle in the top bar (or press `D`). Overview hides API snippets and edge cases. |
| Checklist | The fraud checklist saves progress in the viewer's browser |
| Error lookup | Search all Twilio error codes by number or keyword, with compliance filters. `#errors/<code>` opens one directly. |

## Error code data

The Error lookup chapter reads `js/errors-data.js`, a snapshot of Twilio's public catalog (`twilio.com/docs/api/errors/twilio-error-codes.json`, about 3,000 codes). Twilio's server doesn't allow browsers on other sites to load that file, so the guide ships its own copy. The copy only loads when someone opens the Error lookup chapter.

Refresh it before customer meetings (needs Node 18+):

```bash
node scripts/update-errors.mjs
```

Compliance filters (10DLC, Toll-free, Profiles & bundles, and so on) match keywords in each error's title. Tune them in `ERROR_FILTERS` in `js/content.js`.

## Updating content

All copy, facts and source links live in [`js/content.js`](js/content.js):

- `SOURCES`: every official link, defined once and referenced by ID.
- `CHAPTERS`: right-pane copy for each chapter. Sections with `deep: true` appear only in Deep dive.
- `SENDERS`, `COMPLIANCE`, `CHECKLIST`, `FAQ`: data for the interactive left pane.

Facts were verified against Twilio docs on **2026-10-30**, and all 69 links returned HTTP 200 with no redirects. Fees, review timelines and Compliance Embeddable status (beta or pilot) change often, so re-check them before each customer engagement and update the "Verified" pill in `isv-messaging-onboarding.html`.

Items tagged **confirm with Twilio** are either not covered by public docs or described differently on different Twilio pages:

- Whether Canadian long codes sending to US recipients need 10DLC registration.
- The RCS country list.
