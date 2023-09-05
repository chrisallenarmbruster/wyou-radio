import React from "react"
import { useState, useEffect } from "react"
import SpotifyPlayer, { spotifyApi } from "react-spotify-web-playback"

export default function Player({ accessToken, trackUris }) {
  const [player, setPlayer] = useState(null)
  const [play, setPlay] = useState(false)
  const [audio] = useState(
    new Audio(
      "audio/ElevenLabs_2023-09-01T23_59_37_Donny - very deep_gen_s50_sb75_se0_b_m2.mp3"
    )
  )

  audio.addEventListener("play", () => {
    console.log("Audio started playing")
    if (player) player.setVolume(0.5)
  })

  audio.addEventListener("ended", async () => {
    console.log("Audio ended")
    if (player) {
      await player.setVolume(1)
      await player.getVolume().then((state) => {
        if (!state) {
          return
        }
        console.log("Volume state", state)
        !state ? setPlay(false) : setPlay(true)
      })
    }
  })

  useEffect(() => {
    setPlay(true), [trackUris]
  })

  if (!accessToken) return null
  let djCue, volumeCue
  return (
    <SpotifyPlayer
      getPlayer={(player) => {
        console.log(player)
        setPlayer(player)
      }}
      token={accessToken}
      showSaveIcon
      callback={(state) => {
        console.log(state)

        if (!state.isPlaying) {
          console.log("State is not playing, clearing scheduled DJ audio")
          clearTimeout(djCue)
          setPlay(true)
        }
        if (state.isPlaying && !state.error) {
          console.log(
            `State is playing and no error, scheduling DJ audio in ${
              state.track.durationMs -
              state.progressMs -
              (audio.duration && (audio.duration * 1000) / 2)
            } milliseconds`
          )
          clearTimeout(djCue)
          djCue = setTimeout(() => {
            console.log("VOLUME DOWN")
            console.log("DJ CUE")
            audio.play()
          }, state.track.durationMs - state.progressMs - (audio?.duration && (audio.duration * 1000) / 2))
        }
      }}
      play={play}
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
