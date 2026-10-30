// POST /api/checkout creates a Stripe Checkout Session when STRIPE_SECRET_KEY is set as a host secret.
// Only used when COMMERCE.STRIPE_ENABLED is true in src/commerce.js.
async function createStripeCheckout(request, env) {
  if (!env.STRIPE_SECRET_KEY) return Response.json({ error: "Stripe is not configured." }, { status: 501 });
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const lines = Array.isArray(body?.lines) ? body.lines.slice(0, 50) : [];
  if (!lines.length) return Response.json({ error: "Cart is empty." }, { status: 400 });

  const origin = new URL(request.url).origin;
  const form = new URLSearchParams({
    mode: "payment",
    success_url: `${origin}/#/order/success`,
    cancel_url: `${origin}/#/order/cancel`,
    "shipping_address_collection[allowed_countries][0]": "US",
    "automatic_tax[enabled]": "false",
  });
  lines.forEach((l, i) => {
    const amount = Math.round(Number(l.unitAmount));
    const qty = Math.round(Number(l.quantity));
    if (!(amount > 0 && qty > 0)) return;
    form.set(`line_items[${i}][quantity]`, String(qty));
    form.set(`line_items[${i}][price_data][currency]`, "usd");
    form.set(`line_items[${i}][price_data][unit_amount]`, String(amount));
    form.set(`line_items[${i}][price_data][product_data][name]`, String(l.name).slice(0, 250));
    if (l.description) form.set(`line_items[${i}][price_data][product_data][description]`, String(l.description).slice(0, 500));
  });
  // NOTE: prices come from the browser. Before going live with Stripe, look prices up server-side
  // from the catalog so a customer can't change them.

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, "content-type": "application/x-www-form-urlencoded" },
    body: form,
  });
  const data = await res.json();
  if (!res.ok) return Response.json({ error: data?.error?.message || "Stripe error." }, { status: 502 });
  return Response.json({ url: data.url });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/checkout" && request.method === "POST") return createStripeCheckout(request, env);

    const response = await env.ASSETS.fetch(request);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");

    if (response.status !== 404 || !acceptsHtml || !["GET", "HEAD"].includes(request.method)) {
      return response;
    }

    const indexUrl = new URL(request.url);
    indexUrl.pathname = "/index.html";
    indexUrl.search = "";
    return env.ASSETS.fetch(new Request(indexUrl, request));
  },
};
