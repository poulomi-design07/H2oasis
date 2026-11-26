
const supabase = require("../config/supabase");
const { z } = require("zod");

// Intake validation schema
const intakeSchema = z.object({
    drink_id: z.string()
        .uuid("Invalid drink ID")
        .optional()
        .nullable(),

    quantity_ml: z.number()
        .int("Quantity must be a whole number")
        .min(1, "Quantity must be greater than 0")
        .max(10000, "Quantity cannot exceed 10000 ml"),

    consumed_at: z.string()
        .datetime({ offset: true, message: "Invalid date and time format" })
        .optional()
});

// Record a drink intake
const createIntake = async (req, res) => {
    try {
        // Validate incoming data
        const validation = intakeSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid intake data",
                errors: validation.error.issues.map(issue => ({
                    field: issue.path.join("."),
                    message: issue.message
                }))
            });
        }

        const { drink_id, quantity_ml, consumed_at } = validation.data;

        let drinkName = "Water";
        let hydrationFactor = 1.0;

        // Fetch selected drink details
        if (drink_id) {
            const { data: drink, error: drinkError } = await supabase
                .from("drinks")
                .select("id, name, hydration_factor")
                .eq("id", drink_id)
                .eq("is_active", true)
                .maybeSingle();

            if (drinkError) throw drinkError;

            if (!drink) {
                return res.status(404).json({
                    success: false,
                    message: "Drink not found or inactive"
                });
            }

            drinkName = drink.name;
            hydrationFactor = Number(drink.hydration_factor);
        }

        const hydrationMl = Math.round(
            quantity_ml * hydrationFactor
        );

        const intakeData = {
            user_id: req.user.uid,
            drink_id: drink_id || null,
            drink_name: drinkName,
            quantity_ml,
            hydration_factor: hydrationFactor,
            hydration_ml: hydrationMl,
            ...(consumed_at ? { consumed_at } : {})
        };

        const { data, error } = await supabase
            .from("intake_logs")
            .insert(intakeData)
            .select()
            .single();

        if (error) throw error;

        return res.status(201).json({
            success: true,
            message: "Intake recorded successfully",
            data
        });

    } catch (error) {
        console.error("Create intake error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to record intake"
        });
    }
};

// Get logged-in user's intake history
const getIntakeHistory = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("intake_logs")
            .select("*")
            .eq("user_id", req.user.uid)
            .order("consumed_at", { ascending: false })
            .limit(50);

        if (error) throw error;

        return res.status(200).json({
            success: true,
            message: "Intake history fetched successfully",
            data
        });

    } catch (error) {
        console.error("Get intake history error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch intake history"
        });
    }
};

// Delete an intake record
const deleteIntake = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("intake_logs")
            .delete()
            .eq("id", id)
            .eq("user_id", req.user.uid)
            .select()
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Intake record not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Intake deleted successfully",
            data
        });

    } catch (error) {
        console.error("Delete intake error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to delete intake"
        });
    }
};

module.exports = {
    createIntake,
    getIntakeHistory,
    deleteIntake
};
