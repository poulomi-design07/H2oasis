const test = require("node:test");
const assert = require("node:assert/strict");
const fetchAllRows = require("../src/utils/fetchAllRows");

test("fetches all pages until the final partial page", async () => {
    const pages = [
        Array.from({ length: 2 }, (_, i) => ({ id: i + 1 })),
        [{ id: 3 }]
    ];
    let calls = 0;

    const rows = await fetchAllRows(() => ({
        range: async (from, to) => {
            assert.equal(from, calls * 2);
            assert.equal(to, from + 1);
            return { data: pages[calls++], error: null };
        }
    }), 2);

    assert.deepEqual(rows, [{ id: 1 }, { id: 2 }, { id: 3 }]);
    assert.equal(calls, 2);
});

test("throws a Supabase pagination error", async () => {
    await assert.rejects(
        fetchAllRows(() => ({
            range: async () => ({
                data: null,
                error: new Error("database unavailable")
            })
        })),
        /database unavailable/
    );
});
