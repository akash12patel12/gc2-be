const User = require("../models/user");
const Message = require("../models/message")
const { Op } = require("sequelize");
const Group = require("../models/group")
const UserGroup = require("../models/user_group");
const userGroup = require("../models/user_group");
const Invitation = require("../models/invitation")
require("dotenv").config();

exports.isTheUserIsAdminOfTheActiveGroup = async (req,res) => {
    const groupId = req.body.activeGroupId;
    const userId = req.user.userId ;
    UserGroup.findOne({where : {
        GroupId : groupId,
        UserId : userId,
    }}).then(user=>{
        if(user.isAdmin){
            return res.json({isAdmin : true})
        }
        else {
            return res.json({isAdmin : false})
        }
    }).catch(err=>{
        return res.json({err})
    })

}

exports.removeUser = async (req ,res) =>{
    //check if remover is admin of the group 
    const removerUser = await UserGroup.findOne({
        where : {UserId : req.user.userId  }
    });
    if(!removerUser.isAdmin){
        return res.status(401).json({ error: "Only Admins Can Remove!" });
    }
    //Removing User
    const { UserId , GroupId} = req.body
    const userToBeRemoved = await userGroup.findOne({
        where : {UserId, GroupId}
    });
    if(!userToBeRemoved){
        return res.status(404).json({error : 'No User Found!'})
    }
  
    userToBeRemoved.destroy();
  
    return res.status(200).json({Message : "User Removed"})

    
}

exports.makeAdmin = async (req,res) =>{
     //check if admin maker is admin of the group 
     const adminMaker = await UserGroup.findOne({
        where : {UserId : req.user.userId  }
    });
    if(!adminMaker.isAdmin){
        return res.status(401).json({ error: "Only Admins Can Make Other Users Admin!" });
    }
    const { UserId , GroupId} = req.body
    const usertoBeAdmin = await userGroup.findOne({
        where : {UserId, GroupId}
    });
    if(!usertoBeAdmin){
        return res.status(404).json({error : 'No User Found!'})
    }
    //check if already an admin
    if(usertoBeAdmin.isAdmin){
        return res.status(200).json({ Message:"Already An Admin" })
    }

    //making admin
    
    
    usertoBeAdmin.isAdmin = true ;
    await usertoBeAdmin.save();
    
    return res.status(200).json({Message : `${usertoBeAdmin.username} Is Now Admin`})

}