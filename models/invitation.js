const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Invitation = sequelize.define("Invitation", {
  groupId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  groupName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  status: {
    type: Sequelize.ENUM("pending", "accepted"),
    defaultValue: "pending",
  },
});

module.exports = Invitation;
