import React from "react"
import { useState, useEffect } from "react"
import SpotifyPlayer, { spotifyApi } from "react-spotify-web-playback"

export default function Player({ accessToken, trackUris, spotifyApi }) {
  const [play, setPlay] = useState(false)
  const [audio] = useState(
    new Audio(
      "audio/ElevenLabs_2023-09-01T23_59_37_Donny - very deep_gen_s50_sb75_se0_b_m2.mp3"
    )
  )

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
  let djCue, volumeCue
  return (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      callback={(state) => {
        console.log(state)

        if (!state.isPlaying) {
          console.log("State is not playing, clearing scheduled DJ audio")
          clearTimeout(djCue)
          clearTimeout(volumeCue)
          setPlay(true)
        }
        if (state.isPlaying && !state.error) {
          console.log(
            `State is playing and no error, scheduling DJ audio in ${
              state.track.durationMs - state.progressMs - 6500
            } milliseconds`
          )
          clearTimeout(djCue)
          djCue = setTimeout(() => {
            console.log("VOLUME DOWN")
            console.log("DJ CUE")
            spotifyApi.setVolume(50)
            audio.play()
            clearTimeout(volumeCue)
            volumeCue = setTimeout(() => {
              console.log("VOLUME UP")
              spotifyApi.setVolume(100)
            }, 13000)
          }, state.track.durationMs - state.progressMs - 6500)
        }
      }}
      play={play}
      // play={true}
      uris={trackUris ? trackUris : []}
      // or can use uri of playlist
      // uris={["spotify:playlist:6WESoRu7keGwiyag0owvuV"]}
      initialVolume={1}
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
