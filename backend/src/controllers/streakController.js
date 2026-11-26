
const supabase = require("../config/supabase");

const getStreak = async (req, res) => {
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

        const getLocalDate = (date) => {
            return new Intl.DateTimeFormat("en-CA", {
                timeZone,
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }).format(date);
        };

        const today = getLocalDate(new Date());

        // Fetch all intake records
        const { data: intakes, error: intakeError } = await supabase
            .from("intake_logs")
            .select("hydration_ml, consumed_at")
            .eq("user_id", userId);

        if (intakeError) throw intakeError;

        // Fetch complete hydration goal history
        const { data: goals, error: goalsError } = await supabase
            .from("hydration_goals")
            .select("target_ml, created_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: true });

        if (goalsError) throw goalsError;

        // Fetch current active goal for the response
        const { data: activeGoal, error: activeGoalError } = await supabase
            .from("hydration_goals")
            .select("target_ml")
            .eq("user_id", userId)
            .eq("is_active", true)
            .maybeSingle();

        if (activeGoalError) throw activeGoalError;

        const currentGoalMl = Number(activeGoal?.target_ml || 0);

        // Convert local date into UTC midnight
        const getLocalDayStart = (dateString) => {
            const [year, month, day] = dateString.split("-").map(Number);

            const target = Date.UTC(year, month - 1, day);

            const parts = new Intl.DateTimeFormat("en-US", {
                timeZone,
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hourCycle: "h23"
            }).formatToParts(new Date(target));

            const values = {};

            parts.forEach(part => {
                values[part.type] = part.value;
            });

            const localAsUTC = Date.UTC(
                Number(values.year),
                Number(values.month) - 1,
                Number(values.day),
                Number(values.hour),
                Number(values.minute),
                Number(values.second)
            );

            return new Date(target - (localAsUTC - target));
        };

        // Find the goal applicable at the start of a particular day
        const getGoalForDate = (date) => {
            const dayStart = getLocalDayStart(date);

            const applicableGoals = goals.filter(goal =>
                new Date(goal.created_at) <= dayStart
            );

            if (applicableGoals.length === 0) {
                return 0;
            }

            return Number(
                applicableGoals[applicableGoals.length - 1].target_ml
            );
        };

        // Calculate total intake for each local date
        const dailyTotals = {};

        intakes.forEach(item => {
            const date = getLocalDate(new Date(item.consumed_at));

            dailyTotals[date] =
                (dailyTotals[date] || 0) + Number(item.hydration_ml || 0);
        });

        // Determine completed days using each day's historical goal
        const completedDates = Object.keys(dailyTotals)
            .filter(date => {
                const goalMl = getGoalForDate(date);

                return goalMl > 0 && dailyTotals[date] >= goalMl;
            })
            .sort();

        const completedSet = new Set(completedDates);

        // Date helpers
        const checkDate = (date) => {
            const [year, month, day] = date.split("-").map(Number);
            return new Date(Date.UTC(year, month - 1, day));
        };

        const formatDate = (date) => date.toISOString().slice(0, 10);

        // Calculate current streak
        let currentStreak = 0;
        let currentDate = checkDate(today);

        // If today is incomplete, continue checking from yesterday
        if (!completedSet.has(today)) {
            currentDate.setUTCDate(currentDate.getUTCDate() - 1);
        }

        while (completedSet.has(formatDate(currentDate))) {
            currentStreak++;

            currentDate.setUTCDate(currentDate.getUTCDate() - 1);
        }

        // Calculate longest streak
        let longestStreak = 0;
        let runningStreak = 0;
        let previousDate = null;

        for (const date of completedDates) {
            const current = checkDate(date);

            if (previousDate) {
                const difference =
                    (current - previousDate) / (1000 * 60 * 60 * 24);

                runningStreak = difference === 1
                    ? runningStreak + 1
                    : 1;
            } else {
                runningStreak = 1;
            }

            longestStreak = Math.max(longestStreak, runningStreak);
            previousDate = current;
        }

        return res.status(200).json({
            success: true,
            message: "Streak fetched successfully",
            data: {
                current_streak: currentStreak,
                longest_streak: longestStreak,
                goal_ml: currentGoalMl
            }
        });

    } catch (error) {
        console.error("Streak error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch streak"
        });
    }
};

module.exports = { getStreak };
