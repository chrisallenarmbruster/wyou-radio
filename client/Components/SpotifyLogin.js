import React from 'react'
import Container from 'react-bootstrap/Container'

const spotifyRedirect =
  process.env.NODE_ENV === 'production'
    ? process.env.SPOTIFY_REDIRECT_URI_PROD
    : process.env.SPOTIFY_REDIRECT_URI_DEV

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${spotifyRedirect}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`

export default function SpotifyLogin() {
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '75vh' }}
    >
      <a className="btn btn-success btn-lg" href={AUTH_URL}>
        Login With Spotify
      </a>
    </Container>
  )
}
