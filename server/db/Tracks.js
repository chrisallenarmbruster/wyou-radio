const { INTEGER } = require("sequelize");
const conn = require("./conn");
const { STRING, INT, JSONB } = conn.Sequelize;

const Tracks = conn.define("tracks", {
  userEmail: {
    type: STRING,
    references: {
      model: "users",
      key: "email",
    },
    primaryKey: true,
    allowNull: false,
  },
  curTrack: {
    type: JSONB,
    allowNull: true,
  },
  nextTrack: {
    type: JSONB,
    allowNull: true,
  },
  currentRundownIndex: {
    type: INT,
    allowNull: true,
  },
});

module.exports = Tracks;
