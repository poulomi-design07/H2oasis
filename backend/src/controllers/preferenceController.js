
const supabase = require("../config/supabase");
const { z } = require("zod");

// Preference validation schema
const preferenceSchema = z.object({
    drink_id: z.string()
        .uuid("A valid drink ID is required"),

    preference_type: z.enum(["preferred", "most_consumed"], {
        message: "Preference type must be preferred or most_consumed"
    })
});

// Get user's drink preferences
const getPreferences = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("user_drink_preferences")
            .select(`
                id,
                preference_type,
                drink_id,
                drinks (
                    name,
                    brand,
                    serving_size_ml,
                    hydration_factor
                )
            `)
            .eq("user_id", req.user.uid);

        if (error) throw error;

        return res.status(200).json({
            success: true,
            message: "Preferences fetched successfully",
            data
        });

    } catch (error) {
        console.error("Get preferences error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch preferences"
        });
    }
};

// Add a drink preference
const addPreference = async (req, res) => {
    try {
        const validation = preferenceSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid preference data",
                errors: validation.error.issues.map(issue => ({
                    field: issue.path.join("."),
                    message: issue.message
                }))
            });
        }

        const { drink_id, preference_type } = validation.data;

        // Check whether the drink exists and is active
        const { data: drink, error: drinkError } = await supabase
            .from("drinks")
            .select("id")
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

        // Prevent duplicate preferences
        const { data: existing, error: findError } = await supabase
            .from("user_drink_preferences")
            .select("id")
            .eq("user_id", req.user.uid)
            .eq("drink_id", drink_id)
            .eq("preference_type", preference_type)
            .maybeSingle();

        if (findError) throw findError;

        if (existing) {
            return res.status(409).json({
                success: false,
                message: "This preference already exists"
            });
        }

        const { data, error } = await supabase
            .from("user_drink_preferences")
            .insert({
                user_id: req.user.uid,
                drink_id,
                preference_type
            })
            .select()
            .single();

        if (error) {
            if (error.code === "23505") {
                return res.status(409).json({
                    success: false,
                    message: "This preference already exists"
                });
            }

            throw error;
        }

        return res.status(201).json({
            success: true,
            message: "Preference added successfully",
            data
        });

    } catch (error) {
        console.error("Add preference error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to add preference"
        });
    }
};

// Delete a drink preference
const deletePreference = async (req, res) => {
    try {
        const { id } = req.params;

        if (!z.string().uuid().safeParse(id).success) {
            return res.status(400).json({
                success: false,
                message: "A valid preference ID is required"
            });
        }

        const { data, error } = await supabase
            .from("user_drink_preferences")
            .delete()
            .eq("id", id)
            .eq("user_id", req.user.uid)
            .select()
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Preference not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Preference deleted successfully"
        });

    } catch (error) {
        console.error("Delete preference error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to delete preference"
        });
    }
};

module.exports = {
    getPreferences,
    addPreference,
    deletePreference
};
