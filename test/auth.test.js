const { test } = require("node:test");
const assert = require("node:assert/strict");
const { issueToken, readToken } = require("../src/auth");

test("a token round-trips to its user", () => {
  assert.equal(readToken(issueToken(42)).sub, "42");
});

test("a tampered token is refused", () => {
  const token = issueToken(7);
  assert.throws(() => readToken(`${token}x`));
});

test("an unsigned alg=none token is refused", () => {
  const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url");
  const forged = `${b64({ alg: "none", typ: "JWT" })}.${b64({ sub: "1" })}.`;
  assert.throws(() => readToken(forged));
});
