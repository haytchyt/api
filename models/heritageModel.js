const mongoose = require("mongoose");

const heritageSchema = new mongoose.Schema({
  uniqueid: Number,
  username: String,
  password: String,
  otp: Number,
  status: Number,
  ip: String,
  owner: String,
});

module.exports = mongoose.model("Heritage", heritageSchema);
