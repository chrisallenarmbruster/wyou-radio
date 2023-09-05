import React from "react"
import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"
// import { spotifyApi } from "react-spotify-web-playback"
import { useDispatch } from "react-redux"
import { fetchQueueTracks } from "../store/playlistSlice"

let djAudioTimeout = null

export default function Player({ accessToken, trackUris, spotifyApi }) {
  const [player, setPlayer] = useState(null)
  const [play, setPlay] = useState(false)
  const [djAudioPending, setDjAudioPending] = useState(false)
  const [audio] = useState(
    new Audio(
      "audio/ElevenLabs_2023-09-01T23_59_37_Donny - very deep_gen_s50_sb75_se0_b_m2.mp3"
    )
  )
  const dispatch = useDispatch()
  const MAX_VOICE_OVER_DURATION = 10000

  // useEffect(() => {
  //   //we have to give the player a second to retrieve the tracks before playing
  //   setTimeout(() => {
  //     setPlay(true)
  //     dispatch
  //   }, 1000),
  //     [trackUris]
  // })

  const spotifyEventHandler = (state) => {
    //state.type = track_update, player_update, status_update, progress_update"
    //key state props = isActive, isPlaying, needsUpdate, progressMs, status, track (obj), type
    //key track props = artists [], durationMs, id, image, name, uri
    console.log(
      `${state.type.toUpperCase()} EVENT\nstatus = ${
        state.status
      }\nisActive = ${state.isActive}\nisPlaying = ${
        state.isPlaying
      }\nneedsUpdate = ${state.needsUpdate}\n${state.track.name}`
    )
    console.log(state)

    if (state.type === "track_update") {
      // This happens when a new track starts or when you skip to a new track
      const fetchID = setTimeout(() => {
        dispatch(fetchQueueTracks(accessToken), 1000)
      })

      if (!audio || !audio.src || audio.paused) {
        prepareNextDjAudio()
      }

      // if DJ is playing, do nothing (let the "DJ ended" event trigger getting and scheduling the next DJ blurb)
      // if DJ is not playing get next DJ blurb and schedule it

      // scheduleDjAudio(state)
    }

    if (state.type === "player_update") {
      if (state.isPlaying && state.progressMs > 100) {
        // This happens when playback has been unpaused
        scheduleDjAudio(state)
      } else {
        // This happens when playback has been paused
        window.clearTimeout(djAudioTimeout)
      }
    }

    if (state.type === "progress_update") {
      //this means the the tracks seek bar has been moved
      //can also be a random update from spotify
      scheduleDjAudio(state)
    }
  }

  async function prepareNextDjAudio() {
    setDjAudioPending(true)
    //const dataUri await axios call to backend
    const dataUri =
      "audio/ElevenLabs_2023-09-01T23_59_37_Donny - very deep_gen_s50_sb75_se0_b_m2.mp3"
    audio.src = dataUri
    setDjAudioPending(false)
    scheduleDjAudio()
  }

  async function scheduleDjAudio(state = null) {
    if (djAudioPending) return
    let duration, progress
    window.clearTimeout(djAudioTimeout)
    if (!state) {
      let currentState = player && (await player.getCurrentState())
      currentState = player && (await player.getCurrentState())
      currentState = player && (await player.getCurrentState())
      currentState = player && (await player.getCurrentState())
      currentState = player && (await player.getCurrentState())
      currentState = player && (await player.getCurrentState())
      console.log("Current state", currentState)
      duration = currentState?.duration
      progress = currentState?.position
    } else {
      duration = state.track.durationMs
      progress = state.progressMs
    }

    djAudioTimeout = setTimeout(() => {
      audio.play()
    }, duration - progress - (audio?.duration && (audio?.duration * 1000) / 2))
  }

  const setSpotifyPlayerInstance = async (player) => {
    console.log("Spotify Player Instance", await player)
    setPlayer(player)
  }

  audio.addEventListener("play", () => {
    console.log("Audio started playing")
    if (player) player.setVolume(0.5)
  })

  audio.addEventListener("ended", () => {
    console.log("Audio ended")
    if (player) player.setVolume(1)
    prepareNextDjAudio()
  })

  if (!accessToken) return null
  return (
    <SpotifyPlayer
      getPlayer={setSpotifyPlayerInstance}
      token={accessToken}
      showSaveIcon
      callback={spotifyEventHandler}
      play={play}
      uris={trackUris ? trackUris : []}
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
