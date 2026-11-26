// Supabase projects commonly cap a response at 1,000 rows.
// Fetch pages until the final partial page so history-based calculations stay complete.
const fetchAllRows = async (createQuery, pageSize = 1000) => {
    const rows = [];

    for (let offset = 0; ; offset += pageSize) {
        const { data, error } = await createQuery()
            .range(offset, offset + pageSize - 1);

        if (error) throw error;

        const page = data || [];
        rows.push(...page);

        if (page.length < pageSize) break;
    }

    return rows;
};

module.exports = fetchAllRows;
