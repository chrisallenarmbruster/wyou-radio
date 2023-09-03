const conn = require("./conn")
const { STRING, BOOLEAN } = conn.Sequelize
// const bcrypt = require("bcrypt")

const User = conn.define("user", {
  email: {
    type: STRING,
    primaryKey: true,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  product: {
    type: STRING,
    allowNull: false,
  },
  display_name: {
    type: STRING,
    allowNull: false,
  },
  isAdmin: {
    type: BOOLEAN,
    defaultValue: false,
  },
})

module.exports = User
