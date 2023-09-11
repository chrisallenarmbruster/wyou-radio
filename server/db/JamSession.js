const conn = require("./conn");
const { STRING } = conn.Sequelize;

const JamSession = conn.define("jamSession", {
  userEmail: {
    type: STRING,
    references: {
      model: "users",
      key: "email",
    },
    allowNull: false,
  },
  jamSessionId: {
    type: STRING,
    primaryKey: true,
  },
});

module.exports = JamSession;
