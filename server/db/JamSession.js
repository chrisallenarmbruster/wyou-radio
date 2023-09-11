const conn = require("./conn");
const { STRING, INTEGER, TEXT } = conn.Sequelize;

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
  runDownIndex: {
    type: INTEGER,
    allowNull: true,
  },
  spotifyTrackId: {
    type: STRING,
    allowNull: true,
  },
  spotifyTrackName: {
    type: STRING,
    allowNull: true,
  },
  spotifyTrackArtist: {
    type: STRING,
    allowNull: true,
  },
  djAudioDataURI: {
    type: TEXT,
    allowNull: true,
  },
  djAudioTranscript: {
    type: TEXT,
    allowNull: true,
  },
});

module.exports = JamSession;
