import React, { Component } from "react"
import SpotifyLogin from "./SpotifyLogin"
import Dashboard from "./Dashboard"
import Container from "react-bootstrap/Container"
import NavBar from "./NavBar"

export class App extends Component {
  render() {
    const code = new URLSearchParams(window.location.search).get("code")
    return (
      <>
        <Container>
          <NavBar />
          {code ? <Dashboard code={code} /> : <SpotifyLogin />}
        </Container>
      </>
    )
  }
}

export default App
