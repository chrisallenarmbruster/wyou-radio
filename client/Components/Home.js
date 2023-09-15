import React from "react"
import Button from "react-bootstrap/Button"
import { Link } from "react-router-dom"

export function Home(props) {
  return (
    <>
      <div>Home</div>
      <Link to="/radio/djs">
        <Button variant="primary">Radio</Button>
      </Link>
    </>
  )
}

export default Home
