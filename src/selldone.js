// Selldone checkout. The site keeps its own cart; at checkout the lines are copied into a Selldone
// guest basket over the Storefront XAPI, the buyer's details are saved on it, and Selldone starts
// payment through the shop's gateway.
//
// Selldone keeps one basket per product type, so a cart holding both printed (PHYSICAL) and
// digital (SERVICE) pieces checks out in two payments: printed first, then digital.
//
// Product and variant ids below were created in the Selldone dashboard (shop "shoutout-studios").
// Prices live in Selldone too: when a price changes, change it there and in catalog.js.

import { findProduct } from "./catalog.js";

const XAPI = "https://xapi.selldone.com";
const GUEST_KEY = "shoutout-selldone-guest";
const PENDING_KEY = "shoutout-selldone-pending";

export const SELLDONE = {
  SHOP: "shoutout-studios",
  CURRENCY: "USD",
  GATEWAY: "stripe_usd", // must be enabled under Selldone > Accounting > Gateways
  COUNTRY: "US",
  PRODUCTS: {
    "player-highlight-card": { id: 737497, type: "PHYSICAL" },
    "multi-photo-player-card": { id: 737498, type: "PHYSICAL" },
    "digital-only-pack": { id: 737503, type: "SERVICE" },
    "premium-legacy-drop": { id: 737499, type: "PHYSICAL" },
    "framed-poster": { id: 737501, type: "PHYSICAL", variants: { Size: { "8 × 10 in": 1478175, "11 × 14 in": 1478176 } } },
    "season-recap-collection": { id: 737500, type: "PHYSICAL" },
    "extra-cards": { id: 737502, type: "PHYSICAL", variants: { Card: { Standard: 1478177, "Multi-photo select": 1478178 } } },
    "rush-proofing": { id: 737504, type: "SERVICE" },
    "school-team-poster": { id: 737505, type: "PHYSICAL" },
    "eagles-digital-only": { id: 737507, type: "SERVICE" },
    "eagles-player-card": { id: 737506, type: "PHYSICAL" },
    "eagles-legacy-drop": { id: 737508, type: "PHYSICAL" },
    "eagles-season-recap": { id: 737509, type: "PHYSICAL" },
    "eagles-team-poster": { id: 737510, type: "PHYSICAL" },
  },
};

// Checkout order: printed pieces first, since they carry the shipping address.
export const BASKET_TYPES = ["PHYSICAL", "SERVICE"];
export const TYPE_LABEL = { PHYSICAL: "printed pieces", SERVICE: "digital pieces" };

export const selldoneProduct = (productId) => SELLDONE.PRODUCTS[productId];

function variantFor(line) {
  const map = selldoneProduct(line.productId)?.variants;
  if (!map) return null;
  const [option, ids] = Object.entries(map)[0];
  const id = ids[line.selections[option]];
  if (!id) throw new Error(`No Selldone variant for ${findProduct(line.productId).name} (${line.selections[option]}).`);
  return id;
}

export function groupLines(lines) {
  const groups = {};
  for (const l of lines) {
    const type = selldoneProduct(l.productId)?.type;
    if (type) (groups[type] ||= []).push(l);
  }
  return BASKET_TYPES.filter((t) => groups[t]).map((type) => ({ type, lines: groups[type] }));
}

export const unmappedLines = (lines) => lines.filter((l) => !selldoneProduct(l.productId));

function store(key, value) {
  try {
    if (value === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}
function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

const errorText = (data, status) => {
  const m = data?.error_msg || data?.message;
  if (typeof m === "string" && m) return m;
  if (m && typeof m === "object") return Object.values(m).flat().join(" ");
  return `Checkout service error (${status}).`;
};

async function xapi(method, path, body) {
  const guest = read(GUEST_KEY);
  const res = await fetch(`${XAPI}/shops/@${SELLDONE.SHOP}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(guest ? { "S-Guest": guest } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) throw new Error(errorText(data, res.status));
  return data;
}

// Shop bootstrap: gives a guest code on first visit and the visitor's open baskets after that.
async function shopInfo() {
  const data = await xapi("GET", "/info");
  if (data.shop?.guest_code && !read(GUEST_KEY)) store(GUEST_KEY, data.shop.guest_code);
  return data;
}

const itemKey = (productId, variantId) => `${productId}:${variantId || ""}`;

// Make the Selldone basket of one type match the site's cart lines exactly.
async function syncBasket(type, lines) {
  const info = await shopInfo();
  const want = new Map();
  for (const l of lines) {
    const p = findProduct(l.productId);
    const sd = selldoneProduct(l.productId);
    const variant = variantFor(l);
    const key = itemKey(sd.id, variant);
    const entry = want.get(key) || { product: sd.id, variant, count: 0, notes: [] };
    entry.count += l.qty;
    const details = Object.entries(l.details).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("; ");
    entry.notes.push(`${p.name} x${l.qty}${details ? ` (${details})` : ""}`);
    want.set(key, entry);
  }

  const open = (info.baskets || []).find((b) => b.type === type);
  for (const item of open?.items || []) {
    if (!want.has(itemKey(item.product_id, item.variant_id))) {
      await xapi("DELETE", `/basket/${item.product_id}`, { currency: SELLDONE.CURRENCY, variant_id: item.variant_id });
    }
  }

  let last;
  for (const e of want.values()) {
    last = await xapi("PUT", `/basket/${e.product}`, { currency: SELLDONE.CURRENCY, count: e.count, variant_id: e.variant });
    await xapi("PUT", `/basket/${e.product}/message`, { message: { "Order details": e.notes.join(" | ") }, variant_id: e.variant });
  }
  return last.basket;
}

function pickShipping(bill) {
  const options = (bill?.store_shipping_options || []).flatMap((o) => o.transportations || []);
  return (options.find((t) => t.type !== "Pickup") || options[0])?.type || null;
}

// Runs one basket through Selldone and hands the buyer to the payment page.
// Resolves "paid" when Selldone completed the order without a redirect.
export async function checkoutBasket(type, lines, buyer) {
  const basket = await syncBasket(type, lines);
  const physical = type === "PHYSICAL";
  const receiver = physical
    ? {
        name: buyer.name,
        phone: buyer.phone,
        address: buyer.address,
        unit: buyer.unit || null,
        city: buyer.city,
        state: buyer.state,
        state_code: buyer.state,
        postal: buyer.postal,
        country: SELLDONE.COUNTRY,
      }
    : null;
  const billing = { custom: false, business: false, name: buyer.name, country: SELLDONE.COUNTRY, state: buyer.state || null, state_code: buyer.state || null, address: buyer.address || null };

  let config = await xapi("PUT", `/baskets/${basket.id}/config`, { guest_email: buyer.email, receiver_info: receiver, billing });
  if (physical) {
    const shipping = pickShipping(config.bill || (await xapi("GET", `/basket/${type}/bill`)).bill);
    if (!shipping) throw new Error("Shipping isn't set up for printed pieces yet.");
    config = await xapi("PUT", `/baskets/${basket.id}/config`, { guest_email: buyer.email, receiver_info: receiver, billing, delivery_info: { type: shipping } });
  }
  const { bill } = await xapi("GET", `/basket/${type}/bill`);
  if (!bill?.can_pay) throw new Error("This order can't be paid yet. Check the details and try again.");

  const back = `${window.location.origin}${window.location.pathname}`;
  store(PENDING_KEY, { type, at: Date.now() });
  const pay = await xapi("POST", `/basket/${type}/buy/${SELLDONE.GATEWAY}`, {
    currency: SELLDONE.CURRENCY,
    amount_check: bill.sum,
    delivery_price: bill.delivery_price,
    code: read(GUEST_KEY),
    return: `${back}#/order/success`,
  });

  if (pay.payed_by_gift_card || pay.free_order || pay.cod) return "paid";
  const url = pay.url || pay.payment?.url || pay.gateway_que?.url;
  if (url) {
    window.location.assign(url);
    return "redirect";
  }
  if (pay.link && pay.method) {
    // Gateway expects a form post with the returned fields.
    const form = document.createElement("form");
    form.method = pay.method;
    form.action = pay.link;
    Object.entries(pay.params || pay.data || {}).forEach(([k, v]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = k;
      input.value = v;
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
    return "redirect";
  }
  store(PENDING_KEY);
  throw new Error("Payment couldn't start. Please try again in a moment.");
}

// Called on the order success page: which basket type was just paid.
export function takePending() {
  const p = read(PENDING_KEY);
  store(PENDING_KEY);
  return p?.type || null;
}
