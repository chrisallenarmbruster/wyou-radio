const conn = require("./conn")
const User = require("./User")
const Profile = require("./Profile")

const syncAndSeed = async () => {
  await conn.sync({ force: false })
  try {
    // put seed operations here
  } catch (err) {
    console.log("error seeding db")
  }
}

if (require.main === module) {
  syncAndSeed()
}

module.exports = syncAndSeed
