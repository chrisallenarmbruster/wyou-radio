import React from "react"
import { Button } from "react-bootstrap"

export default function TrackSearchResult({ track, playTrack, addTrack }) {
  function handlePlay() {
    playTrack(track)
  }

  function handleAdd() {
    addTrack(track)
  }

  return (
    <div
      className="d-flex align-items-center text-light p-2"
      style={{ cursor: "pointer" }}
    >
      <img
        src={track.albumUrl}
        style={{ height: "64px", width: "64px" }}
        className=""
      />
      <div className="ms-3">
        <div className="text-light">{track.title}</div>
        <div className="text-light">{track.artist}</div>
        <Button variant="success" onClick={handlePlay}>
          Play Now
        </Button>
        <Button variant="warning" onClick={handleAdd}>
          Add to Queue
        </Button>
      </div>
    </div>
  )
}
