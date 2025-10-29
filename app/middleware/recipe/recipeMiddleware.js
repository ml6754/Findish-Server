// ensure recipe is valid thats it
const validateRecipe = (req, res, next) => {
    const { requiredIngredients, mealType, cuisineType, measuringSystem } = req.body;

    if (!requiredIngredients || !mealType || !cuisineType || !measuringSystem) {
        return res.status(400).json({
            error: "Missing required fields: requiredIngredients, mealType, cuisineType, or measuringSystem",
        });
    }

    if (!Array.isArray(requiredIngredients) || requiredIngredients.length === 0) {
        return res.status(400).json({ error: "requiredIngredients must be a non-empty string." });
    }

    if (typeof mealType !== "string" || !mealType.trim()) {
        return res.status(400).json({ error: "mealType must be a non-empty string." });
    }

    if (typeof cuisineType !== "string" || !cuisineType.trim()) {
        return res.status(400).json({ error: "cuisineType must be a non-empty string." });
    }

    if (typeof measuringSystem !== "string" || !["metric", "imperial"].includes(measuringSystem.toLowerCase())) {
        return res.status(400).json({ error: "measuringSystem must be 'metric' or 'imperial'." });
    }

    next(); 
};

module.exports = {validateRecipe};
