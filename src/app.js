const express = require("express");
const get = require("lodash/get");
const { fetchRates } = require("./rates");

const posts = [
  { id: 1, title: "Hello", meta: { author: { name: "Ada" } } },
  { id: 2, title: "Second post", meta: {} },
];

function createApp({ rates = fetchRates } = {}) {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.get("/posts/:id", (req, res) => {
    const post = posts.find((p) => p.id === Number(req.params.id));
    if (!post) return res.status(404).json({ error: "Not found" });
    res.json({ id: post.id, title: post.title, author: get(post, "meta.author.name", "unknown") });
  });

  app.post("/posts", (req, res) => {
    const title = get(req.body, "title");
    if (!title) return res.status(400).json({ error: "Title is required" });
    const post = { id: posts.length + 1, title, meta: {} };
    posts.push(post);
    res.status(201).json(post);
  });

  app.get("/rates/:currency", async (req, res) => {
    try {
      res.json(await rates(req.params.currency));
    } catch {
      res.status(502).json({ error: "Rates unavailable" });
    }
  });

  return app;
}

module.exports = { createApp };
