import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { fetchStations, fetchUserStations } from '../store/stationsSlice'
import { fetchDjs } from '../store/djsSlice'
import useAuth from './useAuth'
import Radio from './Radio'
import Home from './Home'
import { Routes, Route } from 'react-router-dom'
import UserProfile from './UserProfile'
import { showProfile } from '../store/userSlice'
import { Col, Row } from 'react-bootstrap'

const AppAuthWrapper = (props) => {
  const accessToken = useAuth(props.code)

  useEffect(() => {
    console.log('AppAuthWrapper useEffect', accessToken)
    props.fetchDjs()
    if (accessToken) {
      props.fetchStations([
        '37i9dQZF1DWXRqgorJj26U',
        '37i9dQZF1DXaJXCbmtHVHV',
        '37i9dQZF1DX2sQHbtx0sdt',
        '37i9dQZF1DXbcP8BbYEQaO',
        '37i9dQZF1DWUajed02NzWR',
      ])
      props.fetchUserStations()
    }
  }, [accessToken])

  return (
    <Col>
      <Row>
        <UserProfile />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="radio/*" element={<Radio />} />
        </Routes>
      </Row>
    </Col>
  )
}

const mapStateToProps = (state) => ({
  accessToken: state.user?.accessToken,
  profile: state.user?.profile,
})

const mapDispatchToProps = (dispatch) => ({
  fetchStations: (stationIds) => dispatch(fetchStations(stationIds)),
  fetchUserStations: () => dispatch(fetchUserStations()),
  fetchDjs: () => dispatch(fetchDjs()),
  showProfile: () => dispatch(showProfile()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppAuthWrapper)
