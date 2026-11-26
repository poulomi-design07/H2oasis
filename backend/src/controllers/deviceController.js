
const supabase = require("../config/supabase");
const { z } = require("zod");

// Device registration validation schema
const deviceSchema = z.object({
    expo_push_token: z.string()
        .trim()
        .min(1, "Expo push token is required")
        .max(255, "Expo push token is too long"),

    device_name: z.string()
        .trim()
        .max(100, "Device name cannot exceed 100 characters")
        .nullable()
        .optional()
        .transform(value => value || null),

    platform: z.enum(["ios", "android"], {
        message: "Platform must be ios or android"
    })
});

// Register a device
const registerDevice = async (req, res) => {
    try {
        // Validate incoming data
        const validation = deviceSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid device data",
                errors: validation.error.issues.map(issue => ({
                    field: issue.path.join("."),
                    message: issue.message
                }))
            });
        }

        const {
            expo_push_token,
            device_name,
            platform
        } = validation.data;

        // Check whether this token is already registered
        const { data: existingDevice, error: findError } = await supabase
            .from("device_tokens")
            .select("id")
            .eq("user_id", req.user.uid)
            .eq("expo_push_token", expo_push_token)
            .maybeSingle();

        if (findError) throw findError;

        let data;
        let error;

        const deviceData = {
            user_id: req.user.uid,
            expo_push_token,
            device_name,
            platform,
            is_active: true
        };

        if (existingDevice) {
            const result = await supabase
                .from("device_tokens")
                .update(deviceData)
                .eq("id", existingDevice.id)
                .eq("user_id", req.user.uid)
                .select()
                .single();

            data = result.data;
            error = result.error;
        } else {
            const result = await supabase
                .from("device_tokens")
                .insert(deviceData)
                .select()
                .single();

            data = result.data;
            error = result.error;
        }

        if (error) throw error;

        return res.status(200).json({
            success: true,
            message: "Device registered successfully",
            data
        });

    } catch (error) {
        console.error("Register device error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to register device"
        });
    }
};

// Get registered devices
const getDevices = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("device_tokens")
            .select("*")
            .eq("user_id", req.user.uid)
            .eq("is_active", true);

        if (error) throw error;

        return res.status(200).json({
            success: true,
            message: "Devices fetched successfully",
            data
        });

    } catch (error) {
        console.error("Get devices error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch devices"
        });
    }
};

// Remove a registered device
const deleteDevice = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("device_tokens")
            .delete()
            .eq("id", id)
            .eq("user_id", req.user.uid)
            .select()
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Device not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Device removed successfully"
        });

    } catch (error) {
        console.error("Delete device error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to remove device"
        });
    }
};

module.exports = {
    registerDevice,
    getDevices,
    deleteDevice
};
