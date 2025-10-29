// Defines a Mongoose schema for a "User" model in MongoDB, including user information fields
// (name, email, password) and account status fields (date created, last login, password change status, admin rights, and verification status)

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let User = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: null },
  isAdmin: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  exclude: { type: [String], default: [], required: true },
  soonExpWhen: { type: Number, default: 80, required: true }, // Percentage
  deleteExpWhen: { type: Number, default: 7, required: true },
  timeZoneOffset: { type: Number, default: -5, required: true },
  notificationWhen: { type: Number, default: 11, required: true },
  FCMToken: { type: String, required: false },
});
module.exports = mongoose.model("User", User);
