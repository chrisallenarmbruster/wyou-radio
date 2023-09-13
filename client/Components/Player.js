import React from "react"
import { connect } from "react-redux"
import Button from "react-bootstrap/Button"

const Player = (props) => {
  return (
    <div className="text-light">
      <h1 className="h3 my-3">Player</h1>
      <div>Track: {props.track?.name}</div>
      <div>
        Artist: {props.track?.artists.map((artist) => artist.name).join(", ")}
      </div>
      <div>Station: {props.station?.name}</div>
      <div>DJ: {props.dj?.name}</div>
      <div>
        <Button
          className="mt-3"
          onClick={() => props.playContext({ uri: props.station.uri })}
        >
          Play
        </Button>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    track: state.player.currentTrack,
    station: state.stations.currentStation,
    dj: state.djs.currentDj,
  }
}

export default connect(mapStateToProps)(Player)
