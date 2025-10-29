const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Ingredient = new Schema({
  name: { type: String, required: true },
  tags: { type: [String], required: true },
  lifetime: { type: Number, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: false },
});
module.exports = mongoose.model("Ingredient", Ingredient);
