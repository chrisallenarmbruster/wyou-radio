const conn = require('./conn')
const { STRING, INTEGER, FLOAT } = conn.Sequelize

const Profile = conn.define('profile', {
  userEmail: {
    type: STRING,
    references: {
      model: 'users',
      key: 'email',
    },
    allowNull: false,
    primaryKey: true,
    unique: true,
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
