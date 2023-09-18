const router = require("express").Router()
const SpotifyWebApi = require("spotify-web-api-node")
const { User, Profile } = require("../db")

router.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
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

router.post("/login", (req, res) => {
  const code = req.body.code
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
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
          function ({ body }) {
            User.findOrCreate({
              where: { email: body.email },
              defaults: {
                product: body.product,
                display_name: body.display_name,
              },
            })
            req.session.email = body.email
            req.session.displayName = body.display_name
          },
          function (err) {
            console.log("Something went wrong!", err)
          }
        )
        .then(() => {
          req.session.accessToken = body.access_token
          req.session.refreshToken = body.refresh_token
          req.session.expiresIn = body.expires_in
          console.log(`${req.session.email} logged in successfully!`)
          Profile.findOrCreate({
            where: { userEmail: req.session.email },
          }).then(([profile, created]) => {
            res.json({
              email: req.session.email,
              displayName: req.session.displayName,
              accessToken: req.session.accessToken,
              refreshToken: req.session.refreshToken,
              expiresIn: req.session.expiresIn,
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
