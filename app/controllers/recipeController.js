const recipeService = require("@app/services/recipe/recipeService");
// this generates a recipe shouldn't it be a post?
const getRecipe = async (req, res) => {
    try {
        const { requiredIngredients, optionalIngredients, mealType, cuisineType, measuringSystem } = req.body;

        if (!requiredIngredients || !mealType || !cuisineType || !measuringSystem) {
            return res.status(400).json({
                error: "Missing required fields: requiredIngredients, mealType, cuisineType, or measuringSystem",
            });
        }

        const recipe = await recipeService.createRecipe(
            requiredIngredients,
            optionalIngredients,
            mealType,
            cuisineType,
            measuringSystem
        );

        const ingredientList = await recipeService.createIngredientList(recipe, measuringSystem);

        const recipeName = await recipeService.createName(recipe);

        res.status(200).json({
            name: recipeName,
            directions: recipe,
            ingredients: ingredientList,
        });
    } catch (error) {
        console.error("Error generating recipe:", error.message);
        res.status(500).json({
            error: "Failed to generate recipe. Please try again later.",
        });
    }
};

module.exports = { getRecipe };
