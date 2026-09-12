# Commercial readiness: what exists, what is honest to say, what remains

## The free path today

Everything in the app is free and works without any account or key:

- 29 lessons (Stage 1: computer basics through Python errors), each with an
  explanation, worked example, prediction, exercise, building task,
  understanding check and recap, in English and Hebrew, in three paces.
- One growing project (*Your text adventure*, 15 steps from lesson 5 to module
  6) plus three module projects (guessing game, calculator, quiz game).
- Module tests, placement (test out), spaced review, weak-spot detection,
  achievements without penalties, glossary, progress export/import, and a
  "continue in PyCharm" download.
- The built-in guide (scripted from the lesson, the learner's error and check
  results) is always available.
- The AI assistant is a genuine model through the owner's OpenRouter account;
  it is off for learners until the owner switches it on.

Stages 2–10 are described in the curriculum map and labelled **planned**
everywhere. Nothing in the app claims they exist.

## What the finished course and project are worth (as the app presents it)

- Completing Stage 1 means: 29 lessons whose exercises, building tasks and
  understanding checks all passed, seven module tests passed, and a playable
  text adventure the learner wrote and can run outside the browser.
- The app makes no claim of certification, accreditation, job outcomes or
  earnings, and shows no reviews, testimonials or learner counts. Add those
  only when they are real, and keep counts verifiable.

## Not activated (deliberately)

No payments, subscriptions, accounts, analytics, tracking or third-party
services are wired in. Progress lives in the browser. The only external call
is the AI assistant (owner-configured) and the Netlify function that serves it.

## What remains for a paid product

| Area | Needed | Notes |
|---|---|---|
| Accounts | Sign-up/sign-in (email link or OAuth), a user id on the server | Without accounts there is no way to charge or to sync. Netlify Identity was retired; consider Clerk, Supabase Auth or Auth.js on a small backend. |
| Progress sync | Server storage of the progress document (it is already a single JSON with a version and a migration path) | Keep local-first: the browser stays the working copy; sync on change with conflict rules ("newest completion wins"). |
| Payments | A provider (Stripe or Paddle for VAT handling), a plan model (monthly/yearly/family), webhooks to mark entitlement on the account | Decide what is paid: today the sensible split is "all lessons free, AI assistant + future stages paid", which keeps a meaningful free path. |
| Cancellation and refunds | Self-serve cancellation, clear end-of-period behaviour, refund policy page | Required by consumer law in most markets; write it before charging. |
| AI usage allowance | Per-account monthly token or message allowance tied to the plan, enforced server-side (the per-device limits exist; per-account ones need accounts) | Show remaining allowance in the assistant panel. Keep the built-in guide free. |
| Legal | Privacy policy, terms, children's data handling (parents' consent for under-13s in many places), cookie notice if analytics are added | The app currently sets no cookies except the owner session on the owner page. |
| Operations | Error reporting for the function, a status check, backups of the config/usage store, key rotation procedure | The usage report on the owner page is a start. |
| Content | Stages 2+ written to the same standard, or the free scope narrowed honestly | Do not sell planned stages. |

## Suggested next step

Run the pilot in `docs/PILOT.md`. Fix what it finds. Only then choose an
account provider and a payment provider, in that order.
