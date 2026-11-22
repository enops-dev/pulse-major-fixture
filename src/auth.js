const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";

function issueToken(userId) {
  return jwt.sign({ sub: String(userId) }, SECRET, { algorithm: "HS256", expiresIn: "1h" });
}

function readToken(token) {
  return jwt.verify(token, SECRET, { algorithms: ["HS256"] });
}

module.exports = { issueToken, readToken };
