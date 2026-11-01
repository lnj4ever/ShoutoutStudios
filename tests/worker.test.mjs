import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import worker, { stripeLineItems } from "../worker/index.js";

test("serves existing static assets without a fallback", async () => {
  const calls = [];
  const response = await worker.fetch(new Request("https://example.test/assets/app.js"), {
    ASSETS: {
      fetch: async (request) => {
        calls.push(new URL(request.url).pathname);
        return new Response("asset", { status: 200 });
      },
    },
  });

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/assets/app.js"]);
});

test("falls back to index.html for an unknown app route", async () => {
  const calls = [];
  const response = await worker.fetch(
    new Request("https://example.test/flow/step-two?source=share", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async (request) => {
          const url = new URL(request.url);
          calls.push(url.pathname + url.search);
          return new Response(url.pathname === "/index.html" ? "app" : "missing", {
            status: url.pathname === "/index.html" ? 200 : 404,
          });
        },
      },
    },
  );

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/flow/step-two?source=share", "/index.html"]);
});

test("does not turn missing API or write requests into the app shell", async () => {
  for (const request of [
    new Request("https://example.test/api/missing", { headers: { accept: "application/json" } }),
    new Request("https://example.test/flow", { method: "POST", headers: { accept: "text/html" } }),
  ]) {
    let calls = 0;
    const response = await worker.fetch(request, {
      ASSETS: {
        fetch: async () => {
          calls += 1;
          return new Response("missing", { status: 404 });
        },
      },
    });

    assert.equal(response.status, 404);
    assert.equal(calls, 1);
  }
});

test("build emits the static site", async () => {
  await access(new URL("../dist/client/index.html", import.meta.url));
});

test("prices Stripe lines from the catalog, not the browser", () => {
  const [item] = stripeLineItems([{ productId: "framed-poster", selections: { Size: "11 × 14 in" }, qty: 2, unitAmount: 1, details: { "Athlete name": "Pat" } }]);
  assert.equal(item.unitAmount, 7500);
  assert.equal(item.quantity, 2);
  assert.equal(item.name, "Framed Poster (11 × 14 in)");
});

test("rejects inquiry-only products and unknown options", () => {
  assert.throws(() => stripeLineItems([{ productId: "sponsor-spotlight", selections: { Format: "Sponsor" }, qty: 1 }]));
  assert.throws(() => stripeLineItems([{ productId: "framed-poster", selections: { Size: "Huge" }, qty: 1 }]));
});

test("creates a Stripe Checkout Session with server-side prices", async () => {
  const realFetch = globalThis.fetch;
  let sent;
  globalThis.fetch = async (url, init) => {
    sent = { url, body: new URLSearchParams(init.body), auth: init.headers.authorization };
    return Response.json({ url: "https://checkout.stripe.com/c/test" });
  };
  try {
    const response = await worker.fetch(
      new Request("https://shop.test/api/checkout", {
        method: "POST",
        body: JSON.stringify({ lines: [{ productId: "eagles-player-card", selections: { Format: "Player card" }, qty: 3, details: { "Athlete name": "Pat" } }] }),
      }),
      { STRIPE_SECRET_KEY: "sk_test_x", ASSETS: { fetch: async () => new Response("", { status: 404 }) } },
    );
    assert.equal(response.status, 200);
    assert.equal((await response.json()).url, "https://checkout.stripe.com/c/test");
    assert.equal(sent.url, "https://api.stripe.com/v1/checkout/sessions");
    assert.equal(sent.auth, "Bearer sk_test_x");
    assert.equal(sent.body.get("line_items[0][price_data][unit_amount]"), "3500");
    assert.equal(sent.body.get("line_items[0][quantity]"), "3");
    assert.equal(sent.body.get("shipping_address_collection[allowed_countries][0]"), "US");
  } finally {
    globalThis.fetch = realFetch;
  }
});
