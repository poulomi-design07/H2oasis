
const supabase = require("../config/supabase");
const { z } = require("zod");

// Reminder settings validation schema
const reminderSchema = z.object({
    is_enabled: z.boolean({
        message: "is_enabled must be true or false"
    }),

    interval_minutes: z.number()
        .int("Interval must be a whole number")
        .min(15, "Interval must be at least 15 minutes")
        .max(1440, "Interval cannot exceed 1440 minutes"),

    start_time: z.string()
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid start time format"),

    end_time: z.string()
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid end time format"),

    active_days: z.array(
        z.number().int().min(1).max(7)
    )
        .min(1, "Select at least one active day")
        .refine(
            days => new Set(days).size === days.length,
            "Active days must be unique"
        ),

    reminder_message: z.string()
        .max(200, "Reminder message cannot exceed 200 characters")
        .nullable()
        .optional()
}).refine(
    data => data.start_time < data.end_time,
    {
        message: "End time must be later than start time",
        path: ["end_time"]
    }
);

// Get reminder settings
const getReminderSettings = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("reminder_settings")
            .select("*")
            .eq("user_id", req.user.uid)
            .maybeSingle();

        if (error) throw error;

        return res.status(200).json({
            success: true,
            message: "Reminder settings fetched successfully",
            data
        });

    } catch (error) {
        console.error("Get reminder settings error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch reminder settings"
        });
    }
};

// Create or update reminder settings
const saveReminderSettings = async (req, res) => {
    try {
        // Validate incoming request
        const validation = reminderSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid reminder settings",
                errors: validation.error.issues.map(issue => ({
                    field: issue.path.join("."),
                    message: issue.message
                }))
            });
        }

        const {
            is_enabled,
            interval_minutes,
            start_time,
            end_time,
            active_days,
            reminder_message
        } = validation.data;

        const settingsData = {
            user_id: req.user.uid,
            is_enabled,
            interval_minutes,
            start_time,
            end_time,
            active_days,
            reminder_message: reminder_message || null
        };

        const { data, error } = await supabase
            .from("reminder_settings")
            .upsert(settingsData, { onConflict: "user_id" })
            .select()
            .single();

        if (error) throw error;

        return res.status(200).json({
            success: true,
            message: "Reminder settings saved successfully",
            data
        });

    } catch (error) {
        console.error("Save reminder settings error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to save reminder settings"
        });
    }
};

module.exports = {
    getReminderSettings,
    saveReminderSettings
};
