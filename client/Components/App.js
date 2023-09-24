import React, { Component } from 'react'
import { connect } from 'react-redux'
import SpotifyLogin from './SpotifyLogin'
import { Container, Col, Row } from 'react-bootstrap'
import NavBar from './NavBar'
import AppAuthWrapper from './AppAuthWrapper'

export class App extends Component {
  render() {
    const code = new URLSearchParams(window.location.search).get('code')
    return (
      <Container
        style={{ display: 'flex', maxWidth: '95vw', maxHeight: '95vh' }}
      >
        <Col
          style={{
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Row>
            <NavBar />
          </Row>
          <Row>
            {code || this.props.user?.details?.accessToken ? (
              <AppAuthWrapper code={code || null} />
            ) : (
              <SpotifyLogin />
            )}
          </Row>
        </Col>
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
})

export default App
