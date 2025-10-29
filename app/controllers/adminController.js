const { seedIngredients } = require("@app/services/admin/seedService");

const {
  runExpiringItems,
} = require("@app/jobs/admin/scheduleNotificationManual");

// Ingredients routes
const addIngredient = async (req, res) => {
  try {
    const { ingredients } = req.body; // Expecting an array of ingredient objects
    console.log(ingredients);
    if (!ingredients || !Array.isArray(ingredients)) {
      return res
        .status(400)
        .json({ error: "'ingredients' should be an array" });
    }

    const savedIngredients = await seedIngredients(ingredients);

    return res.status(201).json({
      message: "Ingredients seeded successfully",
      data: savedIngredients,
    });
  } catch (err) {
    console.error(`500: ${err.message}`);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// Update ingredients
const updateIngredient = async (req, res) => {
  try {
    // Logic for updating an ingredient (not defined yet)
  } catch (err) {
    console.error(`500: ${err}`);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete ingredients
const deleteIngredient = async (req, res) => {
  try {
    // Logic for deleting an ingredient (not defined yet)
  } catch (err) {
    console.error(`500: ${err}`);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// deprecated no longer usables
const checkExpiring = async (req, res) => {
  try {
    runExpiringItems();
    return res.status(200).json({
      message: "Job ran",
    });
  } catch (err) {
    console.error(`500: ${err}`);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  addIngredient,
  updateIngredient,
  deleteIngredient,
};
