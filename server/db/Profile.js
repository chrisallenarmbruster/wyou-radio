const conn = require("./conn")
const { STRING, INTEGER, FLOAT } = conn.Sequelize

const Profile = conn.define("profile", {
  userEmail: {
    type: STRING,
    references: {
      model: "users", // 'users' is the name of the table that Sequelize creates based on the User model
      key: "email",
    },
    allowNull: false,
  },
  name: {
    type: STRING,
    allowNull: true,
  },
  zip: {
    type: INTEGER,
    allowNull: true,
  },
  lat: {
    type: FLOAT,
    allowNull: true,
  },
  long: {
    type: FLOAT,
    allowNull: true,
  },
})

module.exports = Profile
