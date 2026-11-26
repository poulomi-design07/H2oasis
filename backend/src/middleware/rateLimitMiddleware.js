const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 120;
const MAX_TRACKED_CLIENTS = 10000;

const clients = new Map();

const apiRateLimit = (req, res, next) => {
    const now = Date.now();
    const key = req.ip || req.socket.remoteAddress || "unknown";
    let record = clients.get(key);

    if (!record || now >= record.resetAt) {
        record = {
            count: 0,
            resetAt: now + WINDOW_MS
        };
    }

    record.count += 1;
    clients.set(key, record);

    if (clients.size > MAX_TRACKED_CLIENTS) {
        for (const [clientKey, clientRecord] of clients) {
            if (now >= clientRecord.resetAt) clients.delete(clientKey);
            if (clients.size <= MAX_TRACKED_CLIENTS) break;
        }
    }

    res.setHeader("RateLimit-Limit", String(MAX_REQUESTS));
    res.setHeader(
        "RateLimit-Remaining",
        String(Math.max(0, MAX_REQUESTS - record.count))
    );
    res.setHeader("RateLimit-Reset", String(Math.ceil(record.resetAt / 1000)));

    if (record.count > MAX_REQUESTS) {
        res.setHeader(
            "Retry-After",
            String(Math.max(1, Math.ceil((record.resetAt - now) / 1000)))
        );

        return res.status(429).json({
            success: false,
            message: "Too many requests. Please try again later."
        });
    }

    return next();
};

module.exports = apiRateLimit;
