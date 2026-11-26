
const supabase = require("../config/supabase");
const { z } = require("zod");

// Hydration goal validation schema
const hydrationGoalSchema = z.object({
    target_ml: z.number()
        .int("Hydration target must be a whole number")
        .min(1, "Hydration target must be greater than 0")
        .max(10000, "Hydration target cannot exceed 10000 ml"),

    goal_type: z.enum(["manual", "recommended"], {
        message: "Goal type must be manual or recommended"
    })
});

// Create or update hydration goal
const saveHydrationGoal = async (req, res) => {
    try {
        // Validate request body
        const validation = hydrationGoalSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid hydration goal data",
                errors: validation.error.issues.map(issue => ({
                    field: issue.path.join("."),
                    message: issue.message
                }))
            });
        }

        const { target_ml, goal_type } = validation.data;

        // Save goal using atomic database function
        const { data, error } = await supabase.rpc(
            "save_hydration_goal",
            {
                p_user_id: req.user.uid,
                p_target_ml: target_ml,
                p_goal_type: goal_type
            }
        );

        if (error) throw error;

        return res.status(201).json({
            success: true,
            message: "Hydration goal saved successfully",
            data
        });

    } catch (error) {
        console.error("Save hydration goal error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to save hydration goal"
        });
    }
};

// Get active hydration goal
const getHydrationGoal = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("hydration_goals")
            .select("*")
            .eq("user_id", req.user.uid)
            .eq("is_active", true)
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Hydration goal not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Hydration goal fetched successfully",
            data
        });

    } catch (error) {
        console.error("Get hydration goal error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch hydration goal"
        });
    }
};

module.exports = {
    saveHydrationGoal,
    getHydrationGoal
};
