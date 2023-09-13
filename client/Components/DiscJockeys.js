import React from "react"
import { connect } from "react-redux"
import { setCurrentDj } from "../store/djsSlice"

const DiscJockeys = (props) => {
  return (
    <div className="text-light">
      <h1 className="h3 my-3">Select Disc Jockey</h1>
      {props.djs.map((dj) => (
        <div key={dj.name} onClick={() => props.setCurrentDj(dj)}>
          {dj.name}
        </div>
      ))}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    djs: state.djs.allDjs,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentDj: (dj) => dispatch(setCurrentDj(dj)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DiscJockeys)
