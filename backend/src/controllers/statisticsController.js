
const supabase = require("../config/supabase");
const { z } = require("zod");

// Statistics query validation schema
const statisticsSchema = z.object({
    days: z.enum(["7", "30"])
        .optional()
        .default("7")
});

// Get statistics for the last 7 or 30 days
const getStatistics = async (req, res) => {
    try {
        const userId = req.user.uid;

        // Validate incoming query parameters
        const validation = statisticsSchema.safeParse(req.query);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid statistics parameters",
                errors: validation.error.issues.map(issue => ({
                    field: issue.path.join("."),
                    message: issue.message
                }))
            });
        }

        const days = Number(validation.data.days);

        // Get user's timezone
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("timezone")
            .eq("id", userId)
            .maybeSingle();

        if (profileError) throw profileError;

        const timeZone = profile?.timezone || "Asia/Kolkata";

        // Convert a date into the user's local date
        const getLocalDate = (date) => {
            return new Intl.DateTimeFormat("en-CA", {
                timeZone,
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }).format(date);
        };

        // Convert local midnight into UTC
        const localMidnightToUTC = (dateString) => {
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

        // Calculate the requested date range
        const today = getLocalDate(new Date());
        const todayDate = new Date(`${today}T00:00:00Z`);

        const startDate = new Date(todayDate);
        startDate.setUTCDate(startDate.getUTCDate() - (days - 1));

        const startDateString = startDate.toISOString().slice(0, 10);

        const endDate = new Date(todayDate);
        endDate.setUTCDate(endDate.getUTCDate() + 1);

        const endDateString = endDate.toISOString().slice(0, 10);

        const startOfPeriod = localMidnightToUTC(startDateString);
        const endOfPeriod = localMidnightToUTC(endDateString);

        // Fetch intake records for this period
        const { data: intakes, error: intakeError } = await supabase
            .from("intake_logs")
            .select("hydration_ml, consumed_at")
            .eq("user_id", userId)
            .gte("consumed_at", startOfPeriod.toISOString())
            .lt("consumed_at", endOfPeriod.toISOString());

        if (intakeError) throw intakeError;

        // Fetch hydration goal history
        const { data: goals, error: goalsError } = await supabase
            .from("hydration_goals")
            .select("target_ml, created_at")
            .eq("user_id", userId)
            .lt("created_at", endOfPeriod.toISOString())
            .order("created_at", { ascending: true });

        if (goalsError) throw goalsError;

        // Get the current active goal for the overall response
        const { data: activeGoal, error: activeGoalError } = await supabase
            .from("hydration_goals")
            .select("target_ml")
            .eq("user_id", userId)
            .eq("is_active", true)
            .maybeSingle();

        if (activeGoalError) throw activeGoalError;

        const currentGoalMl = Number(activeGoal?.target_ml || 0);

        // Prepare daily intake totals
        const dailyTotals = {};

        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);
            date.setUTCDate(date.getUTCDate() + i);

            const dateString = date.toISOString().slice(0, 10);
            dailyTotals[dateString] = 0;
        }

        // Calculate intake for each local date
        intakes.forEach(item => {
            const date = getLocalDate(new Date(item.consumed_at));

            if (dailyTotals[date] !== undefined) {
                dailyTotals[date] += Number(item.hydration_ml || 0);
            }
        });

        // Calculate the goal applicable at the start of each day
        const dailyStatistics = Object.entries(dailyTotals).map(
            ([date, total]) => {
                const dayStart = localMidnightToUTC(date);

                const applicableGoals = goals.filter(goal =>
                    new Date(goal.created_at) <= dayStart
                );

                const applicableGoal = applicableGoals.length
                    ? applicableGoals[applicableGoals.length - 1]
                    : null;

                const goalMl = Number(applicableGoal?.target_ml || 0);

                return {
                    date,
                    total_intake_ml: total,
                    goal_ml: goalMl,
                    goal_completed: goalMl > 0 && total >= goalMl
                };
            }
        );

        // Calculate overall statistics
        const totalIntake = dailyStatistics.reduce(
            (sum, day) => sum + day.total_intake_ml,
            0
        );

        const completedDays = dailyStatistics.filter(
            day => day.goal_completed
        ).length;

        return res.status(200).json({
            success: true,
            message: "Statistics fetched successfully",
            data: {
                period_days: days,
                total_intake_ml: totalIntake,
                average_daily_intake_ml: Math.round(totalIntake / days),
                goal_ml: currentGoalMl,
                completed_days: completedDays,
                daily_statistics: dailyStatistics
            }
        });

    } catch (error) {
        console.error("Statistics error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch statistics"
        });
    }
};

module.exports = {
    getStatistics
};
