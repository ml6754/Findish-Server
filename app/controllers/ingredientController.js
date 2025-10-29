const ingredientService = require("@app/services/ingredient/IngredientService");
// just gets all ingredients now lol
const getIngredients = async (req, res) => {
  try {
    const user = req.user;
    let ingredients = await ingredientService.getIngredients();
    if (!ingredients) {
      return res.status(404).json({ error: "Ingredient not found" });
    }
    return res.status(200).json({ ingredients: ingredients });
  } catch (err) {
    console.error(`500: ${err}`);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
module.exports = {
  getIngredients,
};
