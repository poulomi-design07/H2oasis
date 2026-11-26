
const supabase = require("../config/supabase");

// Get all active drinks
const getDrinks = async (req, res) => {
    try {
        const userId = req.user.uid;

        const { data, error } = await supabase
            .from("drinks")
            .select(`
                id,
                name,
                brand,
                serving_size_ml,
                hydration_factor,
                category_id,
                drink_categories (
                    name
                )
            `)
            .eq("is_active", true)
            .or(`created_by.is.null,created_by.eq.${userId}`)
            .order("name");

        if (error) throw error;

        return res.status(200).json({
            success: true,
            message: "Drinks fetched successfully",
            data
        });

    } catch (error) {
        console.error("Get drinks error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch drinks"
        });
    }
};

// Get all drink categories
const getDrinkCategories = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("drink_categories")
            .select("*")
            .order("name");

        if (error) throw error;

        return res.status(200).json({
            success: true,
            message: "Drink categories fetched successfully",
            data
        });

    } catch (error) {
        console.error("Get drink categories error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch drink categories"
        });
    }
};

module.exports = {
    getDrinks,
    getDrinkCategories
};
