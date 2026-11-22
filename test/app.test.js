const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { createApp } = require("../src/app");

let server;
let base;

before(async () => {
  const app = createApp({ rates: async (currency) => ({ base: currency, rates: { EUR: 0.9 } }) });
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

test("health answers ok", async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
});

test("a post includes its author, or unknown", async () => {
  assert.equal((await (await fetch(`${base}/posts/1`)).json()).author, "Ada");
  assert.equal((await (await fetch(`${base}/posts/2`)).json()).author, "unknown");
  assert.equal((await fetch(`${base}/posts/99`)).status, 404);
});

test("creating a post needs a title", async () => {
  const bad = await fetch(`${base}/posts`, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
  assert.equal(bad.status, 400);
  const ok = await fetch(`${base}/posts`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ title: "New" }) });
  assert.equal(ok.status, 201);
});

test("rates come from the client", async () => {
  const res = await fetch(`${base}/rates/USD`);
  assert.deepEqual(await res.json(), { base: "USD", rates: { EUR: 0.9 } });
});

test("the axios client points at the rates vendor", () => {
  const { client } = require("../src/rates");
  assert.equal(client.defaults.baseURL, "https://api.frankfurter.app");
});

test("lodash is upgraded and get keeps its default behaviour", () => {
  assert.equal(require("lodash/package.json").version, "4.18.1");
  const get = require("lodash/get");
  assert.equal(get({ a: { b: 1 } }, "a.b", "x"), 1);
  assert.equal(get({}, "a.b", "x"), "x");
});
