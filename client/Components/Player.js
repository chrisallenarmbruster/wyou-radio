import React from "react"
import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"

export default function Player({ accessToken, trackUris, spotifyApi }) {
  const [play, setPlay] = useState(false)

  useEffect(() => {
    setPlay(true), [trackUris]
    // spotifyApi.setVolume(50).then(
    //   function () {
    //     console.log("Setting volume to 50.")
    //   },
    //   function (err) {
    //     //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
    //     console.log("Something went wrong!", err)
    //   }
    // )
  })

  if (!accessToken) return null

  return (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      callback={(state) => {
        console.log(state)
        if (!state.isPlaying) setPlay(true)
      }}
      play={play}
      // play={true}
      uris={trackUris ? trackUris : []}
      // or can use uri of playlist
      // uris={["spotify:playlist:6WESoRu7keGwiyag0owvuV"]}
      styles={{
        activeColor: "#fff",
        bgColor: "#333",
        color: "#fff",
        loaderColor: "#fff",
        sliderColor: "#1cb954",
        trackArtistColor: "#ccc",
        trackNameColor: "#fff",
      }}
    />
  )
}
