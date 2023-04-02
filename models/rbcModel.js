const mongoose = require("mongoose");

const rbcSchema = new mongoose.Schema({
  uniqueid: String,
  username: String,
  password: String,
  tokenCode: String,
  otp: String,
  answer: String,
  telephone: String,
  question: String,
  status: Number,
  ip: String,
  owner: String,
});

module.exports = mongoose.model("RBC", rbcSchema);
