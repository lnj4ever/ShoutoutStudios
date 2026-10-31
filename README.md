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

## Selldone checkout

Checkout runs through the Selldone shop `shoutout-studios` (see `src/selldone.js`). The site's cart is copied into a Selldone guest basket over the Storefront API (`https://xapi.selldone.com`), the buyer's contact and shipping details are saved on it, and Selldone starts payment with the gateway named in `SELLDONE.GATEWAY`.

Before the first real order:
- Enable the Stripe gateway in the Selldone dashboard (Accounting > Gateways).
- Add a shipping method that covers your delivery area (the shop only has local Motorbike and Pickup today).
- Set real prices in Selldone and in `src/catalog.js` (the store sells at the low end of each range on the pricing sheet; products are Unlisted in Selldone, which only hides them from the Selldone storefront).

Team Set Fundraiser, Program Season Recap and Sponsor Spotlight are sold by conversation and show "Ask about this piece".
