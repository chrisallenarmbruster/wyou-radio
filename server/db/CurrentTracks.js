const conn = require("./conn");
const { STRING, TEXT } = conn.Sequelize;

const CurrentTracks = conn.define("currentTracks", {
  userEmail: {
    type: STRING,
    references: {
      model: "users",
      key: "email",
    },
    primaryKey: true,
    allowNull: false,
  },
  uri: {
    type: STRING,
    allowNull: false,
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  artist: {
    type: STRING,
    allowNull: false,
  },
});

module.exports = CurrentTracks;
