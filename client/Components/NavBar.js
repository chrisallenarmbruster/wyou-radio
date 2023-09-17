import React, { Component } from "react"
import Navbar from "react-bootstrap/Navbar"
import { connect } from "react-redux"

export class NavBar extends Component {
  render() {
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#/radio/djs" className="ms-3">
          WYOU Radio
        </Navbar.Brand>

        {this.props.user && (
          <>
            {/* <span className="text-light mx-3">{this.props.user?.email}</span>
            <span className="text-light mx-3">
              DJ: {this.props.currentDj?.djName}
            </span>
            <span className="text-light mx-3">
              Station: {this.props.currentStation?.name}
            </span> */}
          </>
        )}
      </Navbar>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user.details,
  currentStation: state.stations.currentStation,
  currentDj: state.djs.currentDj,
})

export default connect(mapStateToProps)(NavBar)
