const Sequelize = require("sequelize");
// const User = require('./user')
const sequelize = require("../util/database");

const userGroup = sequelize.define("User_group", {
   id : {
    type: Sequelize.INTEGER,
    default: 1,
    autoIncrement: true,
    primaryKey: true,
   },
   isAdmin : {
      type :Sequelize.BOOLEAN ,
      default : false
   },
   username : {
       type : Sequelize.STRING,
       allowNull : false ,

   },
   groupName : {
      type : Sequelize.STRING,
      allowNull : false ,
   }
});

module.exports = userGroup;
