import React from "react"

export default function TrackSearchResult({ track, chooseTrack }) {
  function handlePlay() {
    chooseTrack(track)
  }

  return (
    <div
      className="d-flex m-2 align-items-center"
      style={{ cursor: "pointer" }}
      onClick={handlePlay}
    >
      <img
        src={track.albumUrl}
        style={{ height: "64px", width: "64px", margin: "20px" }}
        className="mx-3"
      />
      <div className="mx-3">
        <div className="text-danger">{track.title}</div>
        <div className="text-muted">{track.artist}</div>
      </div>
    </div>
  )
}
