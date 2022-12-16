const mongoose = require("mongoose");

const suncorpSchema = new mongoose.Schema({
  uniqueid: String,
  accessId: String,
  password: String,
  dob: String,
  telephone: String,
  secToken: String,
  otp: String,
  status: Number,
  ip: String,
  owner: String,
});

module.exports = mongoose.model("Suncorp", suncorpSchema);
