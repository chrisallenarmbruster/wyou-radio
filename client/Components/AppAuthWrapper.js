import React, { useEffect } from "react"
import { connect } from "react-redux"
import { fetchStations, fetchUserStations } from "../store/stationsSlice"
import { fetchDjs } from "../store/djsSlice"
import useAuth from "./useAuth"
import Radio from "./Radio"
import Home from "./Home"
import { Routes, Route } from "react-router-dom"
import { Link } from "react-router-dom"

const AppAuthWrapper = (props) => {
  const accessToken = useAuth(props.code)
  useEffect(() => {
    props.fetchDjs()
    if (accessToken) {
      props.fetchStations([
        "37i9dQZF1DWXRqgorJj26U",
        "37i9dQZF1DXaJXCbmtHVHV",
        "37i9dQZF1DX2sQHbtx0sdt",
        "37i9dQZF1DXbcP8BbYEQaO",
        "37i9dQZF1DWUajed02NzWR",
      ])
      props.fetchUserStations()
    }
  }, [accessToken])

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="radio/*" element={<Radio />} />
      </Routes>
    </>
  )
}

const mapStateToProps = (state) => ({
  accessToken: state.user?.accessToken,
})

const mapDispatchToProps = (dispatch) => ({
  fetchStations: (stationIds) => dispatch(fetchStations(stationIds)),
  fetchUserStations: () => dispatch(fetchUserStations()),
  fetchDjs: () => dispatch(fetchDjs()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppAuthWrapper)
