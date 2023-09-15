import React from "react"
import Button from "react-bootstrap/Button"
import { Link } from "react-router-dom"
import Container from "react-bootstrap/Container"

export function Home(props) {
  return (
    <>
      <Container
        className="text-light text-center d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "75vh" }}
      >
        <h1 className="mb-3">Caution: Extremely Awesome</h1>
        <Link to="/radio/djs">
          <Button variant="success" className="btn-lg">
            I'm Ready
          </Button>
        </Link>
      </Container>
    </>
  )
}

export default Home
