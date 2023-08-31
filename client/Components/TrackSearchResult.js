import React from "react"

export default function TrackSearchResult({ track, chooseTrack }) {
  function handlePlay() {
    chooseTrack(track)
  }

  return (
    <div
      className="d-flex align-items-center text-light p-2"
      style={{ cursor: "pointer" }}
      onClick={handlePlay}
    >
      <img
        src={track.albumUrl}
        style={{ height: "64px", width: "64px" }}
        className=""
      />
      <div className="ms-3">
        <div className="text-light">{track.title}</div>
        <div className="text-light">{track.artist}</div>
      </div>
    </div>
  )
}
