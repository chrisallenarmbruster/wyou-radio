import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { fetchUserStations } from '../store/stationsSlice'
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
    props.fetchDjs()
    if (accessToken) {
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
  fetchUserStations: () => dispatch(fetchUserStations()),
  fetchDjs: () => dispatch(fetchDjs()),
  showProfile: () => dispatch(showProfile()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppAuthWrapper)
