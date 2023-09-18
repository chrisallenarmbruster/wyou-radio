const express = require("express")
const router = express.Router()

router.use("/spotify", require("./spotify"))
router.use("/profile", require("./profile"))
router.use("/content", require("./content"))

module.exports = router
// router.use(contentRoutes)
const PORT = 3000
