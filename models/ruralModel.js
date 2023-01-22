const mongoose = require("mongoose");

const ruralSchema = new mongoose.Schema({
    uniqueid: String,
    accessId: String,
    password: String,
    dob: String,
    telephone: String,
    secToken: String,
    otp: String,
    status: Number,
    ip: String,
    owner: String,
});

module.exports = mongoose.model("Rural", ruralSchema);
