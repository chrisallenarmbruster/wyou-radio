const conn = require('./conn')
const { STRING, BOOLEAN } = conn.Sequelize

const User = conn.define('user', {
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
    defaultValue: 'free',
  },
  display_name: {
    type: STRING,
    allowNull: false,
    defaultValue: 'Spotify User',
  },
  isAdmin: {
    type: BOOLEAN,
    defaultValue: false,
  },
})

module.exports = User
