const conn = require("./conn")
const { STRING, UUID, UUIDV4, BOOLEAN } = conn.Sequelize
const bcrypt = require("bcrypt")

const User = conn.define("user", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  email: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isEmail: true,
    },
    unique: true,
  },
  password: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  isAdmin: {
    type: BOOLEAN,
    defaultValue: false,
  },
})

User.addHook("beforeSave", async (user) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 5)
  }
})

User.authenticate = async function ({ email, password }) {
  const user = await this.findOne({
    where: {
      email,
    },
  })
  if (user && (await bcrypt.compare(password, user.password))) {
    return user
  }
  const error = new Error("bad credentials")
  error.status = 401
  throw error
}

User.prototype.correctPassword = function (candidatePwd) {
  return bcrypt.compare(candidatePwd, this.password)
}

module.exports = User
