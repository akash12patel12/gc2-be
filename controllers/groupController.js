const User = require("../models/user");
const Message = require("../models/message");
const Group = require("../models/group");
const userGroup = require("../models/user_group");
require("dotenv").config();

exports.createGroup = (req, res) => {
  let uid = req.user.userId;
  Group.create({
    name: req.body.groupName,
    createdByUserId: uid,
  })
    .then(async (response) => {
      let uuid = uid;

      let gid = response.dataValues.id;
      const {username}  = await User.findByPk(uid);
      userGroup
        .create({
          username : username,
          groupName : req.body.groupName,
          UserId: uuid,
          GroupId: gid,
          isAdmin : true
        })
        .then((data) => {
           
        })
        .catch((err) => {
          console.log(err);
        });
      res.status(200).json({
        msg: "Group Created",
      });
    })
    .catch((err) => {
      res.status(400).json({ err: err });
    });
};

exports.getGroupsOfUser = async (req, res) => {
  const uid = req.user.userId;
  try {
    const user = await User.findByPk(uid, {
      include : [{model : Group}]
    })
    const groups = user.Groups;
    res.json(groups)
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getActiveGroup = (req, res) =>{
  const id  = req.body.id ;
  Group.findByPk(id).then(group=>{
     res.json(group);
  }).catch(err=>{
     res.json(err);
  })
  

}



