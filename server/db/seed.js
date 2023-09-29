const conn = require('./conn')
const User = require('./User')
const Profile = require('./Profile')

async function setAdmin(email, isAdmin) {
  try {
    await User.upsert({
      email: email,
      isAdmin: isAdmin,
    })
    await Profile.findOrCreate({
      where: { userEmail: email },
    })
  } catch (error) {
    console.error('Upsert failed:', error)
  }
}

const syncAndSeed = async () => {
  await conn.sync({ force: false, alter: true })
  try {
    // put seed operations here
    await setAdmin('chris@armbrustermail.com', true)
    await setAdmin('jejanov@gmail.com', true)
  } catch (err) {
    console.log('error seeding db')
  }
}

if (require.main === module) {
  syncAndSeed()
}

module.exports = syncAndSeed
