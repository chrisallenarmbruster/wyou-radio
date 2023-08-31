const express = require("express")
const app = express()
const session = require("express-session")
const passport = require("passport")
const conn = require("./db/conn")
const { User } = require("./db")
const SequelizeStore = require("connect-session-sequelize")(session.Store)
const sessionStore = new SequelizeStore({ db: conn })
const { auth } = require("./routes")
const { createServer } = require("http")
const httpServer = createServer(app)
const { Server } = require("socket.io")
const io = new Server(httpServer, { cors: { origin: "*" } })
const path = require("path")
const volleyball = require("volleyball")

passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

app.use(volleyball)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, "..", "dist")))

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
)
app.use(passport.initialize())
app.use(passport.session())

app.get("/", (req, res) => res.sendFile("index.html"))

app.use("/api", require("./routes"))

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || "Internal server error")
})

io.on("connection", (socket) => {
  console.log("user connected")
  socket.on("disconnect", function () {
    console.log("user disconnected")
  })
})

module.exports = httpServer
