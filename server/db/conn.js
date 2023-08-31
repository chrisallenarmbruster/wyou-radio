const Sequelize = require("sequelize")
const pkg = require("../../package.json")
const config = {}

if (process.env.QUIET) {
  config.logging = false
}
const conn = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost/${pkg.name}`,
  config
)

module.exports = conn
