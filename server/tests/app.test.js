const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

process.env.OPENAI_API_KEY ||= "test-api-key";
process.env.CLIENT_URL = "http://localhost:3000";

const app = require("../app");

test("GET /health reports that the API is healthy", async () => {
  const response = await request(app).get("/health");

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { status: "ok" });
});

test("CORS allows the configured frontend origin", async () => {
  const response = await request(app)
    .get("/health")
    .set("Origin", process.env.CLIENT_URL);

  assert.equal(
    response.headers["access-control-allow-origin"],
    process.env.CLIENT_URL,
  );
});

test("CORS does not allow an unconfigured origin", async () => {
  const unconfiguredOrigin = "https://untrusted.example";

  const response = await request(app)
    .get("/health")
    .set("Origin", unconfiguredOrigin);

  assert.notEqual(
    response.headers["access-control-allow-origin"],
    unconfiguredOrigin,
  );
});
