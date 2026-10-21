# AI assistant: setup for the site owner

The assistant is a real language model reached through **your** OpenRouter
account. Learners never need a key. Only you, signed in as owner, can configure
the key, the model, learner access and the spending limits, and the server
enforces that: no page, URL or browser setting grants owner rights.

## What runs where

| Piece | Where | Notes |
|---|---|---|
| Owner settings page | the app at `/#/owner` | shows only a masked key status; never the key |
| Backend | Netlify Function `netlify/functions/assistant.mjs` at `/api/assistant/*` | same code as `server/assistant/handler.mjs` |
| Key storage | Netlify Blobs (site store `codepath-assistant`) | AES-256-GCM encrypted with `ASSISTANT_SECRET` |
| Usage counters | Netlify Blobs, one document per day | requests, tokens, USD cost, per device and per model |
| Conversations | each learner's browser (localStorage) | the server keeps no message text |

## One-time configuration (Netlify)

1. In Netlify open the site → **Site configuration → Environment variables** and add:
   - `OWNER_PASSWORD`: a long password only you know (8+ characters; use 20+).
   - `ASSISTANT_SECRET`: a random string of at least 16 characters (for example
     the output of `openssl rand -base64 32`). It encrypts the stored key. If you
     ever change it, the saved key becomes unreadable and you paste it again.
2. Trigger a deploy (push a commit or "Trigger deploy" in the Deploys tab).
   The function and Netlify Blobs need no further configuration.
3. Open `https://<your-site>/#/owner`, sign in with `OWNER_PASSWORD`.

**Where to paste the key:** on that page, in the field *Paste the API key*.
Create the key at <https://openrouter.ai/keys>; set a **credit limit on the key**
there, because that limit is the only hard ceiling on spending. The app never
shows the key again after saving.

## How to test it

1. After saving, press **Test key and model**. The server calls OpenRouter's
   `GET /api/v1/key` (key validity, remaining credit) and `GET /api/v1/models`
   (does the chosen model id exist, what does it cost) and sends a tiny sample
   completion ("Reply with the single word OK", 10 output tokens). The page
   shows each result, including the sample's cost.
2. Open any lesson, press **Get help**, choose the **AI assistant** tab and ask a
   question. As owner you can chat before learners can.
3. When satisfied, switch on **Let learners use the AI assistant**. Learners then
   see the AI tab as available; every request still passes through the limits.

## Limits and budgets (server-enforced)

| Setting | Default | Meaning |
|---|---|---|
| Max output tokens per reply | 700 | `max_tokens` sent to OpenRouter |
| Requests per minute per device | 6 | sliding window, per function instance |
| Requests per day per device | 60 | counted in Blobs before the model is called |
| Daily budget (USD) | 1 | new requests refused once today's reported cost reaches it |
| Monthly budget (USD) | 10 | same for the calendar month |
| Max characters per message | 4000 | |
| Max characters per conversation sent | 16000 | older messages are dropped client-side; the server rejects oversize |
| Max messages per request | 20 | |

Honest notes:

- Costs are the `usage.cost` values OpenRouter reports per request, summed per
  day. They are estimates of what OpenRouter charges and are recorded after a
  reply finishes; a request already in flight is not stopped. Treat the per-key
  limit on openrouter.ai as the real cap.
- "Per device" means a random id stored in the learner's browser plus the
  client IP as a fallback. It is not an identity; a determined person can reset
  it. It is enough to stop accidental loops and casual abuse in a pilot.
- Per-minute limits live in function memory; Netlify may run several instances,
  so the effective limit can be a small multiple of the setting. The per-day
  limit and the budgets are stored and are checked under a lock per instance.
- Netlify Functions have an execution time limit (60 seconds on current plans,
  per Netlify's configuration docs). A reply streams as it is generated, so
  learners see text immediately, but a very long reply on a slow model can be
  cut off at that limit. Keep "Max output tokens per reply" modest (the
  default 700 is fine) and prefer fast models.
- A rough cost picture with the default `google/gemini-3.1-flash-lite`
  ($0.25 per million input tokens and $1.50 per million output tokens, checked
  2026-10-21): 1,500–3,000 input tokens and 200–500 billed output tokens cost
  $0.000675–$0.0015 per message. 10 learners × 30 messages per day cost about
  $0.20–$0.45 per day. This excludes extra reasoning tokens, fees and any
  provider-specific pricing; Hebrew tokenization and conversation history can
  change token counts. Check current prices and actual usage after switching.

## Model selection and retirement migration (2026-10-21)

The default is **Google Gemini 3.1 Flash Lite**. OpenRouter's October 19, 2026
notice says GPT-4o mini, GPT-4o, GPT-4.1 and GPT-4.1 mini retire on
**January 14, 2027**; requests to those models will fail afterward.

The following IDs were present in the [OpenRouter model catalog](https://openrouter.ai/api/v1/models)
on 2026-10-21. Prices are USD per million input/output tokens, not guaranteed
future availability or a quality ranking.

| Candidate | Input / output | Assessment for this tutor |
|---|---|---|
| [Gemini 3.1 Flash Lite](https://openrouter.ai/google/gemini-3.1-flash-lite) | $0.25 / $1.50 | Selected: GA, low latency and economical short replies; a practical candidate for bilingual beginner explanations. |
| [Gemini 2.5 Flash Lite](https://openrouter.ai/google/gemini-2.5-flash-lite) | $0.10 / $0.40 | Cheaper older generation; lifecycle/access uncertainty makes it a less suitable new default. |
| [Qwen3 235B A22B Instruct 2507](https://openrouter.ai/qwen/qwen3-235b-a22b-2507) | $0.09 / $0.55 | Economical multilingual/code alternative without thinking mode; provider speed and price vary, and Hebrew teaching quality needs evaluation. |

Google lists English and Hebrew among [Gemini's supported languages](https://ai.google.dev/gemini-api/docs/models/gemini).
The selection is based on documented capabilities and cost, **not a live
English/Hebrew tutoring benchmark**. All three fit the chat-completions API;
the chosen model advertises support for the existing max_tokens and temperature
parameters. No paid inference was performed for this migration.

**Existing sites need a separate configuration check.** loadConfig merges stored
settings over defaults. Redeploying does not replace a model saved in Netlify
Blobs (or the local file store), even if it is retiring. Do not delete the store
or rotate secrets to change a model.

1. Deploy this change, then inspect `GET /api/assistant/status` for the effective
   model. This public endpoint reveals no key. It cannot distinguish a stored
   selection from a default.
2. Sign in at `/#/owner`. If a retiring model is selected, set the model to
   `google/gemini-3.1-flash-lite` and save settings before January 14, 2027.
   A supported owner-selected model may be retained.
3. Run **Test key and model** and confirm both model availability and a nonempty
   successful sample; then test actual lesson help in English and Hebrew.
4. Ask “Why does range(3) print 0, 1, 2?” and “למה range(3) מדפיס 0, 1, 2?”;
   check correct Python, the requested language, a concise beginner explanation,
   and hints rather than an unsolicited full exercise solution. Also test a
   syntax error with lesson context, streaming completion within 700 output
   tokens, and reported cost. The mock language test verifies plumbing only.
5. Review usage and budget settings before enabling learner access. If quality
   or availability is inadequate, test another supported candidate and save it;
   do not roll back to a retiring model.

A read-only check of the README's live site on 2026-10-21 returned
`model: openai/gpt-4o-mini`, `serverConfigured: false`,
`keyConfigured: false`, and `learnerAccess: false`. Tutoring was disabled.
The effective model is confirmed, but whether that value is persisted remains
unknown. After deployment, repeat the status check; if the old value remains,
the owner must save a replacement separately.

## Security properties (and their tests)

- Owner routes require an HttpOnly, SameSite=Strict cookie holding an
  HMAC-signed token (12 h). Forged or expired tokens are rejected
  (`server/assistant/handler.test.ts`).
- Five failed logins per IP pause sign-in for 15 minutes.
- Mutating requests need the header `X-Requested-With: codepath`.
- The key is encrypted at rest and decrypted only in memory during a request;
  no response, log line or frontend bundle contains it (tested by grepping
  storage dumps and responses in the unit tests, and the frontend never
  receives anything but a masked string).
- The system prompt labels everything from the learner (lesson text, code,
  results) as untrusted data and never includes configuration.
- The assistant cannot run code; learner code runs only in the browser sandbox.

## Local development and the mock

```bash
# terminal 1: a fake OpenRouter (no network, no cost)
npm run api:mock          # http://127.0.0.1:8790/api/v1

# terminal 2: the backend with the mock and a file store in .data/
OWNER_PASSWORD=choose-a-long-password ASSISTANT_SECRET=0123456789abcdef0123 \
OPENROUTER_BASE_URL=http://127.0.0.1:8790/api/v1 npm run api

# terminal 3: the app (Vite proxies /api to the backend)
npm run dev
```

Mock key that "works": `sk-or-v1-mock-valid-key-0000000000`. Keys ending in
`nocredits` / `ratelimited` and models `mock/broken`, `mock/slow`,
`mock/midstream-error` reproduce the error paths. To use the real OpenRouter
locally, omit `OPENROUTER_BASE_URL` and paste a real key on `/#/owner`.

## What was verified without a live key

Everything above was exercised against the mock (unit tests and the browser
tests). The request and stream formats follow OpenRouter's current API
reference (chat completions, SSE with `: OPENROUTER PROCESSING` comments,
`usage` in the final chunk, `data: [DONE]`, the `/key` and `/models`
endpoints, the documented error codes). A first real call still needs your key:
run the **Test key and model** button after pasting it and watch the sample
reply and its cost.
