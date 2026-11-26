const test = require("node:test");
const assert = require("node:assert/strict");
const apiRateLimit = require("../src/middleware/rateLimitMiddleware");

const makeResponse = () => ({
    headers: {},
    statusCode: 200,
    body: null,
    setHeader(name, value) { this.headers[name] = value; return this; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; }
});

test("allows requests under the per-IP limit and blocks request 121", () => {
    const req = { ip: `rate-limit-test-${Date.now()}` };
    let allowed = 0;
    let lastResponse;

    for (let i = 0; i < 121; i++) {
        const res = makeResponse();
        apiRateLimit(req, res, () => { allowed++; });
        lastResponse = res;
    }

    assert.equal(allowed, 120);
    assert.equal(lastResponse.statusCode, 429);
    assert.equal(lastResponse.body.success, false);
    assert.ok(lastResponse.headers["Retry-After"]);
});
