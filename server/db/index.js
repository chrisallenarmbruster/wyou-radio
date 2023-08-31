const conn = require("./conn")
const User = require("./User")
const syncAndSeed = require("./seed")

//Put Relationships here

module.exports = {
  syncAndSeed,
  User,
}
