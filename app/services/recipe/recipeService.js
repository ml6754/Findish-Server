const { openai } = require("../../config/OpenAIConfig");

// my code is so fricking good
const createRecipe = async (
  requiredIngredients,
  ingredients,
  mealType,
  cuisineType,
  measuringSystem
) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "developer",
          content:
            "You are a helpful assistant that follows directions exactly. You meticulously ensure that all requirements are met, and formatting is correct.",
        },
        {
          role: "user",
          content: `I will give you a list of required ingredients, optional ingredients, a MealType and a CuisineType. I want you to create a recipe which must use the required ingredients. 
          You may likely need to add ingredients not in the ingredient list or optional list, feel free to do so, you do not need to use the optional ingredients but it is recommended if it makes sense.
          It is best to base your recipe on a known dish, but you can make small changes to include specific ingredients if it's not possible to be exact.
          If there are enough ingredients for the meal type, use only the ingredients provided, otherwise feel free to add additional ingredients. 
          Include the amount of each ingredient needed for the recipe IN THE DIRECTIONS, e.g. cut 1 pound/kilogram of chicken with the corresponding measuring system. Do not respond with the name of the meal or a list of ingredients.
          Only respond with the recipe directions as a numbered list in this format (no double new lines). Make sure you always use decimals instead of fractions.
          1. Direction 1
          2. Direction 2

          Required Ingredients: ${requiredIngredients}
          Optional Ingredients: ${ingredients}
          MealType: ${mealType}
          CuisineType: ${cuisineType}
          MeasuringSystem:${measuringSystem}`,
        },
      ],
      model: "gpt-4o-mini",
    });
    let message = completion.choices[0].message;
    let summary = message.content.trim();
    let cost = completion.usage.total_tokens;
    return summary;
  } catch (err) {
    console.log(err);
    throw new Error("something went wrong when generating a recipe");
  }
};
//@ljm297 could you check just in case if this is possible in one completion. I don't want each response to handle too much "thinking" so I've split it into 2 but idk if its much better since I haven't tested yet
const createIngredientList = async (recipe, measuringSystem) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "developer",
          content:
            "You are a helpful assistant that follows directions exactly. You meticulously ensure that all requirements are met, and formatting is correct.",
        },
        {
          role: "user",
          content: `I will give you a recipe with a list of directions. These directions should include the amount required for each ingredient but may not always have these amounts.
          Read the recipe and create a list of ingredients used and the amount given the measuring system: ${measuringSystem}. Include ingredients that are offered as sides to the original dish i.e. serve with etc.
          You must output this list with a required numeral quantifier followed by one ingredient, if the you must use a unit of measurement make sure to spell it out in its entirety. 
          e.g.
          1 pound ingredient 1
          2 ingredient 2
          1 handful ingredient 3
          Directions: ${recipe}`,
        },
      ],
      model: "gpt-4o-mini",
    });
    let message = completion.choices[0].message;
    let summary = message.content.trim();
    let cost = completion.usage.total_tokens;
    return summary;
  } catch (err) {
    console.log(err);
    throw new Error("something went wrong when generating a ingredientList");
  }
};
const createName = async (recipe) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "developer",
          content:
            "You are a helpful assistant that follows directions exactly. You meticulously ensure that all requirements are met, and formatting is correct.",
        },
        {
          role: "user",
          content: `Please respond with the name for this recipe and only the name and nothing else: 
          ${recipe}`,
        },
      ],
      model: "gpt-4o-mini",
    });
    let message = completion.choices[0].message;
    let summary = message.content.trim();
    let cost = completion.usage.total_tokens;
    return summary;
  } catch (err) {
    console.log(err);
    throw new Error(
      "something went wrong when generating a name for the recipe"
    );
  }
};

module.exports = {
  createRecipe,
  createIngredientList,
  createName,
};

// this was a test
// const main = async () => {
//   const recipe = await createRecipe(
//     [
//       "chicken",
//       "soy sauce",
//       "green pepper",
//       "chilli pepper",
//       "tapioca pearl",
//       "ice cream",
//     ],
//     ["cornstarch", "baking soda", "peanuts"],
//     "Asian",
//     "Dinner",
//     "Imperial"
//   );
//   const list = await createIngredientList(recipe, "Imperial");
//   const name = await createName(recipe);
//   console.log(name + "\n");
//   console.log("Ingredients\n" + list + "\n");
//   console.log("Directions\n" + recipe);
// };
// main();
