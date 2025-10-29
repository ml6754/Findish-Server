const Ingredient = require("@app/models/Ingredient");
const seedIngredients = async (ingredients) => {
  if (!Array.isArray(ingredients)) {
    throw new Error("Invalid data: 'ingredients' should be an array");
  }

  const ingredientDocs = ingredients.map((ingredient) => ({
    name: ingredient.name,
    tags: ingredient.tags,
    lifetime: ingredient.lifetime,
  }));

  try {
    // Insert ingredients into the database
    const savedIngredients = await Ingredient.insertMany(ingredientDocs, {
      ordered: true,
    });
    return savedIngredients;
  } catch (err) {
    throw new Error(`Failed to seed ingredients: ${err.message}`);
  }
};

module.exports = { seedIngredients };
