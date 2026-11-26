
require("dotenv").config();

const auth = require("../src/config/firebase");

const generateTestToken = async () => {
    try {
        const apiKey = process.env.FIREBASE_WEB_API_KEY;

        if (!apiKey) {
            throw new Error("Firebase Web API Key is missing from .env");
        }

        // Pass a UID in the terminal, or use the default test UID.
        const testUid = process.argv[2] || "h2oassis-postman-test-user";

        const customToken = await auth.createCustomToken(testUid);

        const response = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token: customToken,
                    returnSecureToken: true
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.error?.message || "Failed to generate ID token"
            );
        }

        console.log("\nTest Firebase ID token generated successfully!");
        console.log("Test UID:", testUid);
        console.log("\nID TOKEN (keep private):\n");
        console.log(result.idToken);

    } catch (error) {
        console.error("Token generation failed:", error.message);
        process.exitCode = 1;
    }
};

generateTestToken();
