const conn = require("./conn");
const { STRING, INTEGER, JSONB } = conn.Sequelize;
//  const userTracks = await Tracks.findOne({ where: { userEmail } });
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
    type: INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
});

module.exports = Tracks;
