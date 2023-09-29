const router = require('express').Router()
const SpotifyWebApi = require('spotify-web-api-node')
const { User, Profile } = require('../db')

const spotifyRedirect =
  process.env.NODE_ENV === 'production'
    ? process.env.SPOTIFY_REDIRECT_URI_PROD
    : process.env.SPOTIFY_REDIRECT_URI_DEV

router.post('/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken
  const spotifyApi = new SpotifyWebApi({
    redirectUri: spotifyRedirect,
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    refreshToken,
  })

  spotifyApi
    .refreshAccessToken()
    .then(({ body }) => {
      req.session.accessToken = body.access_token
      req.session.expiresIn = body.expires_in
      res.json({
        accessToken: body.access_token,
        expiresIn: body.expires_in,
        email: req.session.email,
        displayName: req.session.displayName,
        refreshToken: req.session.refreshToken,
      })
    })
    .catch((err) => {
      console.log(err)
      res.sendStatus(400)
    })
})

router.post('/login', (req, res) => {
  console.log(process.env.NODE_ENV, spotifyRedirect)
  const code = req.body.code
  const spotifyApi = new SpotifyWebApi({
    redirectUri: spotifyRedirect,
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  })

  spotifyApi
    .authorizationCodeGrant(code)
    .then(({ body }) => {
      spotifyApi.setAccessToken(body.access_token)
      spotifyApi
        .getMe()
        .then(
          async function ({ body }) {
            const [user, wasCreated] = await User.upsert({
              email: body.email,
              product: body.product,
              display_name: body.display_name,
            })
            req.session.isAdmin = user.isAdmin
            req.session.email = body.email
            req.session.displayName = body.display_name
          },
          function (err) {
            console.log('Something went wrong!', err)
          }
        )
        .then(async () => {
          req.session.accessToken = body.access_token
          req.session.refreshToken = body.refresh_token
          req.session.expiresIn = body.expires_in
          console.log(`${req.session.email} logged in successfully!`)
          await Profile.findOrCreate({
            where: { userEmail: req.session.email },
          }).then(([profile, created]) => {
            res.json({
              email: req.session.email,
              displayName: req.session.displayName,
              accessToken: req.session.accessToken,
              refreshToken: req.session.refreshToken,
              expiresIn: req.session.expiresIn,
              isAdmin: req.session.isAdmin,
              profile,
            })
          })
        })
    })
    .catch((err) => {
      res.sendStatus(400)
    })
})

module.exports = router
