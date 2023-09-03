const router = require("express").Router()
const SpotifyWebApi = require("spotify-web-api-node")
const { User } = require("../db")

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
    .then((data) => {
      req.session.accessToken = data.body.access_token
      req.session.expiresIn = data.body.expires_in
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
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
    .then((data) => {
      spotifyApi.setAccessToken(data.body.access_token)
      spotifyApi
        .getMe()
        .then(
          function (data) {
            User.findOrCreate({
              where: { email: data.body.email },
              defaults: {
                product: data.body.product,
                display_name: data.body.display_name,
              },
            })
            req.session.email = data.body.email
            req.session.displayName = data.body.display_name
          },
          function (err) {
            console.log("Something went wrong!", err)
          }
        )
        .then(() => {
          req.session.accessToken = data.body.access_token
          req.session.refreshToken = data.body.refresh_token
          req.session.expiresIn = data.body.expires_in
          res.json({
            email: req.session.email,
            displayName: req.session.displayName,
            accessToken: req.session.accessToken,
            refreshToken: req.session.refreshToken,
            expiresIn: req.session.expiresIn,
          })
        })
    })
    .catch((err) => {
      res.sendStatus(400)
    })
})

module.exports = router
