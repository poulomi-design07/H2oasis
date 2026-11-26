const auth = require("../config/firebase");

const verifyFirebaseToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || "";

        const token = authHeader.startsWith("Bearer ")
            ? authHeader.slice(7)
            : null;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is required"
            });
        }

        const decodedToken = await auth.verifyIdToken(token);

        req.user = {
            uid: decodedToken.uid,
            phoneNumber: decodedToken.phone_number || null
        };

        next();

    } catch (error) {
        console.error("Firebase token verification failed:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token"
        });
    }
};

module.exports = verifyFirebaseToken;