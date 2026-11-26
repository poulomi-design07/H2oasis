
const supabase = require("../config/supabase");
const { z } = require("zod");

// Profile validation schema
const profileSchema = z.object({
    full_name: z.string()
        .trim()
        .min(1, "Full name is required")
        .max(100, "Full name cannot exceed 100 characters"),

    age_years: z.number()
        .int()
        .min(1)
        .max(120)
        .nullable()
        .optional(),

    weight_kg: z.number()
        .positive()
        .max(500)
        .nullable()
        .optional(),

    gender: z.string().trim().max(30).nullable().optional(),

    activity_level: z.string().trim().max(50).nullable().optional(),

    preferred_unit: z.string().trim().max(20).nullable().optional(),

    weight_unit: z.string().trim().max(20).nullable().optional(),

    timezone: z.string().trim().min(1).max(100).nullable().optional()
});

// Create or update user profile
const createProfile = async (req, res) => {
    try {
        // Validate incoming request body
        const validation = profileSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid profile data",
                errors: validation.error.issues.map(issue => ({
                    field: issue.path.join("."),
                    message: issue.message
                }))
            });
        }

        const {
            full_name,
            age_years,
            weight_kg,
            gender,
            activity_level,
            preferred_unit,
            weight_unit,
            timezone
        } = validation.data;

        // Require verified Firebase phone number
        if (!req.user.phoneNumber) {
            return res.status(400).json({
                success: false,
                message: "Verified phone number is missing. Please sign in using phone OTP."
            });
        }

        const profileData = {
            id: req.user.uid,
            full_name,
            phone_number: req.user.phoneNumber,
            age_years,
            weight_kg,
            gender,
            activity_level,
            preferred_unit,
            weight_unit,
            timezone
        };

        const { data, error } = await supabase
            .from("profiles")
            .upsert(profileData, { onConflict: "id" })
            .select()
            .single();

        if (error) throw error;

        return res.status(201).json({
            success: true,
            message: "Profile saved successfully!",
            data
        });

    } catch (error) {
        console.error("Profile error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to save profile"
        });
    }
};

// Get logged-in user's profile
const getProfile = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", req.user.uid)
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully!",
            data
        });

    } catch (error) {
        console.error("Get profile error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile"
        });
    }
};

module.exports = {
    createProfile,
    getProfile
};
