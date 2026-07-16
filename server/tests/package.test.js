const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("backend package.json points to app.js and the entry file exists", () => {
  const pkgPath = path.join(__dirname, "..", "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

  assert.ok(pkg.name, "package name should be set");
  assert.equal(pkg.scripts.start, "node app.js");
  assert.ok(
    fs.existsSync(path.join(__dirname, "..", "app.js")),
    "app.js should exist",
  );
});
