const mongoose = require("mongoose");

const ubankSchema = new mongoose.Schema({
  uniqueid: Number,
  email: String,
  password: String,
  otp: String,
  secQuestion: String,
  secAnswer: String,
  status: Number,
  ip: String,
  owner: String,
});

module.exports = mongoose.model("uBankOne", ubankSchema);
