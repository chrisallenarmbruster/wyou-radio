const router = require("express").Router()
const { Profile } = require("../db")

router.get("/", async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      where: { userEmail: req.session.email },
    })
    console.log("profile", profile)
    res.json(profile)
  } catch (err) {
    next(err)
  }
})

router.put("/", async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      where: { userEmail: req.session.email },
    })
    await profile.update(req.body)
    res.json(profile)
  } catch (err) {
    next(err)
  }
})

module.exports = router
