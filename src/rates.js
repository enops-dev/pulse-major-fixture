const axios = require("axios");

const client = axios.create({ baseURL: "https://api.frankfurter.app", timeout: 5000 });

async function fetchRates(currency) {
  const { data } = await client.get("/latest", { params: { from: currency } });
  return { base: data.base, rates: data.rates };
}

module.exports = { client, fetchRates };
