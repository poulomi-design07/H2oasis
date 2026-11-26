
const supabase = require("../config/supabase");

// Get today's hydration summary
const getDailySummary = async (req, res) => {
    try {
        const userId = req.user.uid;

        // Get user's timezone
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("timezone")
            .eq("id", userId)
            .maybeSingle();

        if (profileError) throw profileError;

        const timeZone = profile?.timezone || "Asia/Kolkata";

        // Get today's date in the user's timezone
        const now = new Date();

        const dateFormatter = new Intl.DateTimeFormat("en-CA", {
            timeZone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        });

        const today = dateFormatter.format(now);

        // Convert local midnight to UTC
        const getUtcOffset = (date) => {
            const parts = new Intl.DateTimeFormat("en-US", {
                timeZone,
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hourCycle: "h23"
            }).formatToParts(date);

            const values = {};

            parts.forEach((part) => {
                values[part.type] = part.value;
            });

            const localAsUtc = Date.UTC(
                Number(values.year),
                Number(values.month) - 1,
                Number(values.day),
                Number(values.hour),
                Number(values.minute),
                Number(values.second)
            );

            return localAsUtc - date.getTime();
        };

        const [year, month, day] = today.split("-").map(Number);

        const localMidnight = Date.UTC(year, month - 1, day);

        const startOffset = getUtcOffset(
            new Date(localMidnight)
        );

        const nextMidnight = Date.UTC(year, month - 1, day + 1);

        const endOffset = getUtcOffset(
            new Date(nextMidnight - startOffset)
        );

        const startOfDay = new Date(
            localMidnight - startOffset
        ).toISOString();

        const endOfDay = new Date(
            nextMidnight - endOffset
        ).toISOString();

        // Get today's intake records
        const { data: intakes, error: intakeError } = await supabase
            .from("intake_logs")
            .select("hydration_ml")
            .eq("user_id", userId)
            .gte("consumed_at", startOfDay)
            .lt("consumed_at", endOfDay);

        if (intakeError) throw intakeError;

        // Calculate total hydration
        const totalIntakeMl = intakes.reduce(
            (total, item) => total + Number(item.hydration_ml || 0),
            0
        );

        // Get active hydration goal
        const { data: goal, error: goalError } = await supabase
            .from("hydration_goals")
            .select("target_ml")
            .eq("user_id", userId)
            .eq("is_active", true)
            .maybeSingle();

        if (goalError) throw goalError;

        const goalMl = goal ? Number(goal.target_ml) : 0;

        const remainingMl = Math.max(
            goalMl - totalIntakeMl,
            0
        );

        const completionPercentage = goalMl > 0
            ? Math.min(
                Math.round((totalIntakeMl / goalMl) * 100),
                100
            )
            : 0;

        return res.status(200).json({
            success: true,
            message: "Daily summary fetched successfully",
            data: {
                date: today,
                total_intake_ml: totalIntakeMl,
                goal_ml: goalMl,
                remaining_ml: remainingMl,
                completion_percentage: completionPercentage,
                goal_completed: goalMl > 0 && totalIntakeMl >= goalMl
            }
        });

    } catch (error) {
        console.error("Daily summary error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch daily summary"
        });
    }
};

module.exports = {
    getDailySummary
};
