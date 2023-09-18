import React, { Component } from "react"
import Navbar from "react-bootstrap/Navbar"
import { connect } from "react-redux"
import { clearUser, showProfile } from "../store/userSlice"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import NavDropdown from "react-bootstrap/NavDropdown"

const NavBar = (props) => {
  const navigate = useNavigate()

  return (
    <Navbar bg="dark" variant="dark">
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
              <span title="App Settings">
                <NavDropdown.Item onClick={() => props.showProfile()}>
                  Settings
                </NavDropdown.Item>
              </span>
            </NavDropdown>
          </span>
        </>
      )}
    </Navbar>
  )
}

const mapStateToProps = (state) => ({
  user: state.user.details,
  currentStation: state.stations.currentStation,
  currentDj: state.djs.currentDj,
})

const mapDispatchToProps = {
  logout: () => clearUser(),
  showProfile: () => showProfile(),
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
