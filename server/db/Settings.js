const conn = require("./conn");
const { STRING, BOOLEAN } = conn.Sequelize;

const Settings = conn.define("settings", {
  userEmail: {
    type: STRING,
    references: {
      model: "users",
      key: "email",
    },
    primaryKey: true,
    allowNull: false,
  },
  shuffle: {
    type: BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  repeat: {
    type: BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  defaultThing: {
    type: STRING,
    allowNull: true,
  },
});

module.exports = Settings;
