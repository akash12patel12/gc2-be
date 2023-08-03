const User = require("../models/user");
const Message = require("../models/message");
const Group = require("../models/group");
const userGroup = require("../models/user_group");
const Invitation = require("../models/invitation");
require("dotenv").config();

exports.sendInvite = async (req, res) => {
  try {
    const { username, groupId } = req.body;
    // Check if the group exists
    const group = await Group.findOne({
      where: { id: groupId },
    });

    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }
    const groupName = group.name;
    // Check if the user exists
    const user = await User.findOne({
      where: { username: username },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    userId = user.id;
    // Check if the invitation already exists
    const existingInvitation = await Invitation.findOne({
      where: { groupId, userId },
    });

    if (existingInvitation) {
      return res.status(400).json({ error: "Invitation already sent." });
    }

    // Create the invitation
    await Invitation.create({
      groupId: groupId,
      userId: userId,
      groupName: groupName,
    });

    return res.status(200).json({ message: "Invitation sent successfully." });
  } catch (error) {
    console.error("Error sending invitation:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.seeGroupInvites = async (req, res) => {
  const userId = req.user.userId;
  const invitations = await Invitation.findAll({
    where: {
      userId: userId,
      status : 'pending'
    },
  });
  res.status(200).json(invitations);
};

exports.acceptInvite = async (req, res) => {
  try {
    //find invite , user id , group id
    console.log(req.body);
    const id = req.body.id;

    //if invite found
    const invite = await Invitation.findByPk(id);
    //if no invite
    if (!invite) {
      return res
        .status(403)
        .json({ error: "Invitation not found or already rejected." });
    }
    const userId = invite.userId;
    const groupId = invite.groupId;
    //check if group exist
    const group = await Group.findOne({
      where: { id: groupId },
    });

    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }
    const user = await User.findOne({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    const invitation = await Invitation.findOne({
      where: { groupId, userId, status: "pending" },
    });

    if (!invitation) {
      return res
        .status(403)
        .json({ error: "Invitation not found or already accepted." });
    }
    invitation.status = "accepted";
    await invitation.save();
    // create record in user_group
    await userGroup.create({
      GroupId: groupId,
      UserId: userId,
    });
    // send success response
    return res
      .status(200)
      .json({ message: "Invitation accepted successfully." });
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.rejectInvite = async (req, res) => {
  // find invite
  const invite  = await Invitation.findByPk(req.body.id);
  if(!invite){
    return res.status(404).json({error : 'No Such Invitation'});
  }

  await invite.destroy();

  return res.status(200).json({message : 'Invitation Rejected!'})

};
