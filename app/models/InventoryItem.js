const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InventoryItem = new Schema({
  name: { type: String, required: true },
  tags: { type: [String], required: true },
  lifetime: { type: Number, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  soonExpired: { type: Date, required: true },
  expired: {
    type: Date,
    required: true,
    default: function () {
      return new Date(Date.now() + this.lifetime * 24 * 60 * 60 * 1000);
    },
  },
});
module.exports = mongoose.model("InventoryItem", InventoryItem);
