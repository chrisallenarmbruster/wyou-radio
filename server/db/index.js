const conn = require("./conn");
const User = require("./User");
const syncAndSeed = require("./seed");
const Profile = require("./Profile");
const Settings = require("./Settings");
const JamSession = require("./JamSession");
const JamSessionTracks = require("./JamSessionTracks");
const Tracks = require("./Tracks");

User.hasOne(Profile, {
  foreignKey: "userEmail",
  sourceKey: "email",
  onDelete: "CASCADE",
});

Profile.belongsTo(User, {
  foreignKey: "userEmail",
  targetKey: "email",
});

User.hasOne(Settings, {
  foreignKey: "userEmail",
  sourceKey: "email",
  onDelete: "CASCADE",
});

Settings.belongsTo(User, {
  foreignKey: "userEmail",
  targetKey: "email",
});

User.hasMany(JamSession, {
  foreignKey: "userEmail",
});

JamSession.belongsTo(User, {
  foreignKey: "userEmail",
});

JamSession.hasMany(JamSessionTracks, {
  foreignKey: "jamSessionId",
});

JamSessionTracks.belongsTo(JamSession, {
  foreignKey: "jamSessionId",
});

module.exports = {
  syncAndSeed,
  User,
  JamSession,
};
