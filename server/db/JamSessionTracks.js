const conn = require("./conn");
const { STRING, INTEGER, TEXT } = conn.Sequelize;

const JamSessionTracks = conn.define("jamSessionTracks", {
  jamSessionId: {
    type: STRING,
    references: {
      model: "jamSessions",
      key: "jamSessionId",
    },
    allowNull: false,
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

module.exports = JamSessionTracks;
