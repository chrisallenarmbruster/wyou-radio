import React, { Component } from "react"
import { connect } from "react-redux"
import SpotifyLogin from "./SpotifyLogin"
import Dashboard from "./Dashboard"
import Container from "react-bootstrap/Container"
import NavBar from "./NavBar"
import AppAuthWrapper from "./AppAuthWrapper"

export class App extends Component {
  render() {
    const code = new URLSearchParams(window.location.search).get("code")
    return (
      <>
        <Container>
          <NavBar />
          {code || this.props.user?.details?.accessToken ? (
            <AppAuthWrapper code={code || null} />
          ) : (
            <SpotifyLogin />
          )}
        </Container>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
})

export default App
