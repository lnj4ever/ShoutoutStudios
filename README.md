# ShoutoutStudios

The Shoutout Studios store site. React 19 + Vite, served by a Cloudflare Worker.

## Run it

```sh
npm install
npm run dev     # local preview
npm run build   # builds into dist/client
npm test        # worker + build checks (run after a build)
```

## Deploy (Cloudflare Workers Builds)

Connect this repo in Cloudflare → Workers & Pages → Create → Import a repository, then use:

- Production branch: `main`
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

`wrangler.jsonc` points the Worker at `worker/index.js` and serves `dist/client` as static assets.

## Where things live

- `src/catalog.js` — products, tiers, the Eagles Football ’26 collection. **Prices are placeholders.**
- `src/commerce.js` — checkout. Until a provider is set, "Check out" shows an order preview. Selldone checkout is the next integration (pending the shop link); Shopify and Stripe adapters are also included.
- `src/assets/` — logo (cut from Shoutout Studios Logo v1; a vector master is still needed for print) and the hero photo.
- Brand: Ink / Gallery Ivory / Archive Gold, Studio Purple only for limited tiers. Anton + Inter.

Still needed before launch: real prices, the Eagles fundraiser split, real photography (the hero is AI-generated), privacy/terms pages, and analytics.

## Checkout (Stripe)

Checkout uses Stripe's hosted payment page. The Cloudflare Worker (`worker/index.js`) handles `POST /api/checkout`: it prices every cart line from `src/catalog.js`, so prices can't be changed in the browser, then creates a Stripe Checkout Session and sends the shopper there. Shipping address is collected only when the cart has printed pieces.

To go live:
1. In Cloudflare, open the Worker, go to Settings > Variables and Secrets, and add a secret named `STRIPE_SECRET_KEY` (use the `sk_test_...` key first, then the live key).
2. Place a test order with card 4242 4242 4242 4242.

Team Set Fundraiser, Program Season Recap and Sponsor Spotlight are sold by conversation and show "Ask about this piece".

The earlier Selldone checkout is still in `src/selldone.js`; set `SELLDONE_ENABLED = true` in `src/commerce.js` to switch back.
