const conn = require("./conn")
const User = require("./User")

const syncAndSeed = async () => {
  await conn.sync({ force: false })
  try {
    // await User.create({
    //   email: "chris@armbrustermail.com",
    //   password: "123",
    //   isAdmin: true,
    // })
    // await User.create({
    //   email: "jejanov@mac.com",
    //   password: "123",
    //   isAdmin: true,
    // })
  } catch (err) {
    console.log("error seeding db")
  }
}

// syncAndSeed()

module.exports = syncAndSeed
