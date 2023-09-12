import React from "react"
import useAuth from "./useAuth"
import Dashboard from "./Dashboard"
import Home from "./Home"
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom"
import { Button } from "react-bootstrap"
import { Link } from "react-router-dom"

const AppAuthWrapper = ({ code }) => {
  const accessToken = useAuth(code)
  return (
    <>
      AppAuthWrapper
      <Link to="/home">Home</Link>
      <Link to="/radio">Home</Link>
      {/* <BrowserRouter> */}
      <Routes>
        <Route path="home" element={<Home />} />
        <Route path="radio" element={<Dashboard />} />
      </Routes>
      {/* </BrowserRouter> */}
    </>
  )
}

export default AppAuthWrapper
