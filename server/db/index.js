const conn = require("./conn");
const User = require("./User");
const syncAndSeed = require("./seed");
const Profile = require("./Profile");
const Settings = require("./Settings");
const JamSession = require("./JamSession");
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
  sourceKey: "email",
  onDelete: "CASCADE",
});

JamSession.belongsTo(User, {
  foreignKey: "userEmail",
  targetKey: "email",
});

User.hasOne(Tracks, {
  foreignKey: "userEmail",
  sourceKey: "email",
  onDelete: "CASCADE",
});

Tracks.belongsTo(User, {
  foreignKey: "userEmail",
  targetKey: "email",
});

module.exports = {
  syncAndSeed,
  User,
  JamSession,
};
