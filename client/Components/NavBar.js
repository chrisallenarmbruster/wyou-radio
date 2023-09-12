import React, { Component } from "react"
import Navbar from "react-bootstrap/Navbar"
import { connect } from "react-redux"

export class NavBar extends Component {
  render() {
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home" className="ms-3">
          WYOU Radio
        </Navbar.Brand>
        <span className="text-light">{this.props.user?.email}</span>
      </Navbar>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user.details,
})

export default connect(mapStateToProps)(NavBar)
