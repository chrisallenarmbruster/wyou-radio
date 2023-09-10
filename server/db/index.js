const conn = require("./conn");
const User = require("./User");
const syncAndSeed = require("./seed");
const Profile = require("./Profile");
const Settings = require("./Settings");
const JamSession = require("./JamSession");
const CurrentTracks = require("./CurrentTracks");

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
  sourceKey: "email",
  onDelete: "CASCADE",
});

JamSession.belongsTo(User, {
  foreignKey: "userEmail",
  targetKey: "email",
});

User.hasOne(CurrentTracks, {
  foreignKey: "userEmail",
  sourceKey: "email",
  onDelete: "CASCADE",
});

CurrentTracks.belongsTo(User, {
  foreignKey: "userEmail",
  targetKey: "email",
});

module.exports = {
  syncAndSeed,
  User,
  JamSession,
};
