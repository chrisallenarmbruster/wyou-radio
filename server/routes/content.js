const router = require('express').Router()
const Tracks = require('../db/Tracks')
const JamSession = require('../db/JamSession')
const { User, Profile } = require('../db/index.js')
const { djCharacters } = require('../services/djCharacters')
const { showRunner } = require('../services/rundown/showRunner')
const { reset } = require('../services/rundown/rundownUtlities/dbUtilities')
const establishChat = require('../services/establishChat')
let flag = false
let chain
const getLatLonFromZip = require('../services/locationIQ')

router.post('/next-content', async (req, res) => {
  const { curTrack, nextTrack, jamSessionId, djId, station } = req.body
  if (!flag) {
    chain = await establishChat(jamSessionId)
    flag = true
  }

  const userEmail = req.session.email
  //TODO: Update to use djId from req.body

  const user = await User.findOne({
    where: {
      email: userEmail,
    },
    include: {
      model: Profile,
      attributes: ['zip', 'lat', 'long'],
    },
  })
  const userZip = user.profile.zip
  console.log(user.profile.zip, user.profile.lat, user.profile.long)
  if (user.profile.zip && !user.profile.lat && !user.profile.long) {
    ;(async function () {
      const coordinates = await getLatLonFromZip(userZip)
      console.log(coordinates)
      const [profile, created] = await Profile.upsert(
        {
          userEmail: userEmail, // ensure this is the correct email
          lat: coordinates.latitude,
          long: coordinates.longitude,
        },
        {
          returning: true,
          where: {
            userEmail: userEmail,
          },
        }
      )
    })()
  }

  let jamSession

  if (jamSessionId) {
    jamSession = await JamSession.findOne({
      where: {
        jamSessionId: jamSessionId,
        userEmail: userEmail,
      },
    })
  }

  if (!jamSession) {
    jamSession = await JamSession.create({
      userEmail: userEmail,
      jamSessionId: jamSessionId,
    })
  }

  await Tracks.upsert({
    userEmail: userEmail,
    curTrack: curTrack,
    nextTrack: nextTrack,
  })

  const content = await showRunner(
    userEmail,
    jamSessionId,
    user,
    djId,
    station,
    chain
  )
  res.json(content)
})

router.post('/reset', (req, res) => {
  reset()
  res.send('Rundown index reset!')
})

router.get('/dj-characters/:djId', (req, res) => {
  const djId = req.params.djId

  const characterDetails = djCharacters(djId)

  if (characterDetails) {
    res.json(characterDetails)
  } else {
    res.status(404).send('Character not found')
  }
})

router.get('/dj-characters', async (req, res) => {
  const characterDetails = await djCharacters()

  if (characterDetails) {
    res.json(characterDetails)
  } else {
    res.status(404).send('Character not found')
  }
})

module.exports = router
