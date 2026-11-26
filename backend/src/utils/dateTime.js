const isValidTimeZone = (timeZone) => {
    if (typeof timeZone !== "string" || !timeZone.trim()) return false;

    try {
        new Intl.DateTimeFormat("en-US", { timeZone }).format(new Date());
        return true;
    } catch {
        return false;
    }
};

const getDateInTimeZone = (date, timeZone) => {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(date);
};

// Convert a local calendar date's midnight into the matching UTC instant.
// Iteration accounts for timezone offsets and daylight-saving transitions.
const localDateToUtc = (dateString, timeZone) => {
    const [year, month, day] = dateString.split("-").map(Number);
    const targetUtc = Date.UTC(year, month - 1, day);
    let guess = targetUtc;

    for (let i = 0; i < 3; i++) {
        const parts = new Intl.DateTimeFormat("en-US", {
            timeZone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hourCycle: "h23"
        }).formatToParts(new Date(guess));

        const values = {};
        for (const part of parts) values[part.type] = part.value;

        const representedAsUtc = Date.UTC(
            Number(values.year),
            Number(values.month) - 1,
            Number(values.day),
            Number(values.hour),
            Number(values.minute),
            Number(values.second)
        );

        const correction = targetUtc - representedAsUtc;
        guess += correction;

        if (correction === 0) break;
    }

    return new Date(guess);
};

module.exports = {
    isValidTimeZone,
    getDateInTimeZone,
    localDateToUtc
};
