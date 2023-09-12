import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Button from "react-bootstrap/Button"
import { Link } from "react-router-dom"

const Home = () => {
  return (
    <>
      <div>Home</div>
      <Link to="/radio">
        <Button variant="primary">Radio</Button>
      </Link>
    </>
  )
}

export default Home
