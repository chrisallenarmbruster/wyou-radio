import React from "react"
import { connect } from "react-redux"
import Button from "react-bootstrap/Button"

const Tuner = (props) => {
  const { stations } = props
  const { playContext } = props
  return (
    <div className="text-light mb-1">
      <h1 className="h3">Tuner</h1>
      {stations.map((station) => {
        return (
          <div key={station.id}>
            <Button
              className="my-2 me-2"
              onClick={() => playContext({ uri: station.uri })}
            >
              Listen
            </Button>
            {station.name}
          </div>
        )
      })}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    stations: state.tuner.stations,
  }
}

export default connect(mapStateToProps)(Tuner)
