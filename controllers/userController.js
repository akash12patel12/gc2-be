const User = require("../models/user");
const Group = require("../models/group")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userGroup = require("../models/user_group")
require("dotenv").config();

exports.register = (req, res) => {
    // console.log(req.body);
  bcrypt.hash(req.body.password, 3, function (err, hash) {
    // Store hash in your password DB.
    if (!err) {
      User.create({
        username: req.body.username,
        // email: req.body.email,
        password: hash,
        // phone: req.body.phone,
        // totalExpenses: 0,
      })
        .then((r) => {
          res.status(200).json(r);
        })
        .catch((err) => {
          res.status(401).json({ errorMsg: err.errors[0].message });
        });
    } else {
      res.json(err);
    }
  });
};

exports.login = (req, res) => {
  User.findOne({ where: { username: req.body.username } }).then((u) => {
    if (u) {
      bcrypt.compare(req.body.password, u.password, (err, result) => {
        if (result) {
          res
            .status(200)
            .json({ message: "Login success", token: generateToken(u.id) });
        } else {
          res
            .status(401)
            .json({ err: err, message: "Login Failed,  Password Incorrect" });
        }
      });
    } else {
      res.status(404).json({ message: "user not found" });
    }
  });
};

exports.getLoggedInUser = (req,res)=> {
  User.findByPk(req.user.userId).then(user=>{
    return res.status(200).json({User : user.username})
  }).catch(err=>{
    console.log(err);
  })
}

exports.seeGroupUsers = async (req,res)=>{
  const groupId = req.body.groupId;
  const users = await userGroup.findAll({
    where : { groupId : groupId}
  })
  if(users.length !== 0){
    res.json(users)
  }
}

function generateToken(id) {
  return jwt.sign({ userId: id }, process.env.BCRYPT_SECRET);
}
