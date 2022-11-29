const Ips = require("../models/ipsModel");
const Visitors = require("../models/visitorsModel");

const checkIp = async (req, res) => {
  const { ip } = req.params;
  let ipList = await Ips.find({ ip }).exec();
  if (ipList.length) {
    return res.sendStatus(303);
  }
  return res.sendStatus(200);
};

const giveIp = async (req, res) => {
  const { ip } = req.body;
  await Ips.create({ ip });
  res.sendStatus(200);
};

const getVisitors = async (req, res) => {
  const { owner } = req.params;
  let visitors = await Visitors.find({ owner }).exec();
  return res.send(JSON.stringify(visitors.length));
};

const giveVisitor = async (req, res) => {
  const { ip, owner } = req.body;
  await Visitors.create({ ip, owner });
  res.sendStatus(200);
};

module.exports = {
  checkIp,
  giveIp,
  getVisitors,
  giveVisitor,
};
