import React from "react"
import useAuth from "./useAuth"
import Radio from "./Radio"
import Home from "./Home"
import { Routes, Route } from "react-router-dom"
import { Link } from "react-router-dom"

const AppAuthWrapper = ({ code }) => {
  const accessToken = useAuth(code)
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="radio/*" element={<Radio />} />
      </Routes>
    </>
  )
}

export default AppAuthWrapper
