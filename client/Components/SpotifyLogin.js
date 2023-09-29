import React from 'react'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'

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
      <span>
        <Card style={{ width: '24rem' }} bg="dark" border="warning">
          <Card.Header className="text-warning h5">
            Beta Notice{' '}
            <Card.Subtitle className="my-1 text-warning">
              Spotify Development Mode
            </Card.Subtitle>
          </Card.Header>
          <Card.Body>
            <Card.Text className="text-light">
              While we await Spotify App Certification, they restrict API access
              to registered developers. If this isn't you, the app will not
              function properly at this time.
            </Card.Text>
            <Card.Text className="text-light">
              In the meantime, check out our{' '}
              <Card.Link
                href="https://vimeo.com/869263029/f6f59850b1?share=copy"
                className="text-warning"
              >
                video
              </Card.Link>{' '}
              for app details or{' '}
              <Card.Link
                className="text-warning m-0 p-0"
                href="mailto:chris@armbrustermail.com,jejanov@mac.com?subject=WYOU%20Visitor"
              >
                contact
              </Card.Link>{' '}
              us for a private demo.
            </Card.Text>

            <div className="text-center">
              <a className="btn btn-success btn-lg my-3" href={AUTH_URL}>
                Login With Spotify
              </a>
            </div>
          </Card.Body>
        </Card>
      </span>
    </Container>
  )
}
