const test = require("node:test");
const assert = require("node:assert/strict");

const {
    isValidTimeZone,
    getDateInTimeZone,
    localDateToUtc
} = require("../src/utils/dateTime");

test("accepts valid IANA timezones and rejects invalid values", () => {
    assert.equal(isValidTimeZone("Asia/Kolkata"), true);
    assert.equal(isValidTimeZone("Not/A_Timezone"), false);
    assert.equal(isValidTimeZone(""), false);
});

test("formats a timestamp using the requested timezone", () => {
    const timestamp = new Date("2026-11-24T18:30:00.000Z");
    assert.equal(getDateInTimeZone(timestamp, "Asia/Kolkata"), "2026-11-25");
});

test("converts India local midnight to UTC correctly", () => {
    assert.equal(
        localDateToUtc("2026-11-24", "Asia/Kolkata").toISOString(),
        "2026-11-23T18:30:00.000Z"
    );
});

test("accounts for daylight-saving changes in timezone conversion", () => {
    assert.equal(
        localDateToUtc("2026-03-08", "America/New_York").toISOString(),
        "2026-03-08T05:00:00.000Z"
    );
    assert.equal(
        localDateToUtc("2026-03-09", "America/New_York").toISOString(),
        "2026-03-09T04:00:00.000Z"
    );
});
