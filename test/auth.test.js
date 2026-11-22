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
