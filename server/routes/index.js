const express = require("express")
const router = express.Router()

router.use("/auth", require("./auth"))
router.use("/spotify", require("./spotify"))
router.use("/content", require("./content"))

module.exports = router

const PORT = 3000

// router.use(contentRoutes)
