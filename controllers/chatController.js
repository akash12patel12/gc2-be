const User = require("../models/user");
const Message = require("../models/message");
const { Op } = require("sequelize");
const Group = require("../models/group");
require("dotenv").config();

exports.send = async (req, res) => {
  const message = req.body.message;
  const groupId = req.body.groupId;

  const sender = await User.findOne({
    where: { id: req.user.userId },
    include: [{ model: Group, where: { id: groupId } }],
  });

  if (!sender) {
    return res.status(404).json({ error: "User Not Belongs To Group" });
  }

  Message.create({
    senderid: sender.id,
    sender: sender.username,
    message: message,
    GroupId: groupId,
  })
    .then((data) => {
      res.status(200).json({ success: true });
    })
    .catch((err) => {
      res.status(401).json({ success: false });
    });
};

// exports.getall = async (req, res) => {
//   let groupId = req.body.groupId;
//   Message.findAll({
//     where: { GroupId: groupId },
//   })
//     .then((msgs) => {
//       res.status(200).json(msgs);
//     })
//     .catch((err) => {
//       res.status(400).json({ error: err });
//     });
// };

// exports.getLatestTenMessages = async (req, res) => {
//   let LatestMessageId;
//   await Message.findOne({
//     order: [["id", "DESC"]],
//   }).then((data) => {
//     LatestMessageId = data.id;
//   });
//   await Message.findAll({
//     where: {
//       id: {
//         [Op.gt]: LatestMessageId - 10,
//       },
//     },
//   }).then((LatestTenMsgs) => {
//     res.json(LatestTenMsgs);
//   });
// };


// exports.getLatestMessages = async (req, res) => {
//   const lastMsgId = parseInt(req.query.lastMsgId);
//   await Message.findAll({
//     where: {
//       id: {
//         [Op.gt]: lastMsgId,
//       },
//     },
//   }).then((LatestMsgs) => {
//     res.json(LatestMsgs);
//   });
// };


exports.getAllMessagesOfGroup = async (req, res) => {
  const groupId = req.body.groupId;
  const messages = await Message.findAll({
    where: { groupId },
  });
  return res.status(200).json({ messages });
};
