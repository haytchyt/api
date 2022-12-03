const mongoose = require("mongoose");

const ubankSchema = new mongoose.Schema({
  CallSid: String,
  last4: String,
  from: String,
  pin: String,
  otp: String,
  status: Number,
  owner: { type: String, default: "ubankIVR" },
  CallStatus: { type: String, default: "In progress" },
});

module.exports = mongoose.model("uBankIVR", ubankSchema);
