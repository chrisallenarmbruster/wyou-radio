import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import { connect } from 'react-redux'
import {
  clearUser,
  showProfile,
  toggleUseBackendApis,
} from '../store/userSlice'
import { useNavigate } from 'react-router-dom'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Form from 'react-bootstrap/Form'

const NavBar = (props) => {
  const navigate = useNavigate()

  return (
    <Navbar bg="dark" variant="dark" style={{ marginTop: '5px !important' }}>
      <Navbar.Brand className="ms-3">WYOU Radio</Navbar.Brand>

      {props.user && (
        <>
          <span title="Account">
            <NavDropdown
              title={
                <span className="text-light" title="Account">
                  <i className="bi bi-person-circle"></i>
                </span>
              }
              id="basic-nav-dropdown"
            >
              <span title="User ID">
                <NavDropdown.Item className="noselect disabled text-dark">
                  {props.user?.email}
                </NavDropdown.Item>
              </span>
              <NavDropdown.Divider />
              <span title="Log Out">
                <NavDropdown.Item
                  href="/"
                  onClick={() => {
                    props.logout()
                  }}
                >
                  Log Out
                </NavDropdown.Item>
              </span>
              <span title="Profile">
                <NavDropdown.Item onClick={() => props.showProfile()}>
                  Profile
                </NavDropdown.Item>
              </span>
              {props.user?.isAdmin ? (
                <>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    onClick={() => props.toggleUseBackendApis()}
                  >
                    {props.useBackendApis
                      ? 'Disable Backend APIs'
                      : 'Enable Backend APIs'}
                  </NavDropdown.Item>
                </>
              ) : null}
            </NavDropdown>
          </span>
        </>
      )}
    </Navbar>
  )
}

const mapStateToProps = (state) => ({
  user: state.user.details,
  useBackendApis: state.user.useBackendApis,
  currentStation: state.stations.currentStation,
  currentDj: state.djs.currentDj,
})

const mapDispatchToProps = {
  logout: () => clearUser(),
  showProfile: () => showProfile(),
  toggleUseBackendApis: () => toggleUseBackendApis(),
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
