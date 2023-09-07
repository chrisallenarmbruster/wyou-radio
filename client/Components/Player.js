import React, { useEffect } from "react"
import { connect } from "react-redux"
import SpotifyPlayer from "react-spotify-web-playback"
import { fetchQueueTracks } from "../store/playlistSlice"
import store from "../store"

const MAX_VOICE_OVER_DURATION = 10000
let djAudioTimeout = null
let player = { player: null }
let djAudioPending = false
const audio = new Audio()

audio.addEventListener("play", () => {
  console.log("Audio started playing")
  if (player) player?.player?.setVolume(0.25)
})

audio.addEventListener("ended", () => {
  console.log("Audio ended")
  if (player) player?.player?.setVolume(1)
  prepareNextDjAudio()
})

async function prepareNextDjAudio() {
  const dataUri =
    "audio/ElevenLabs_2023-09-01T23_59_37_Donny - very deep_gen_s50_sb75_se0_b_m2.mp3"

  const metadataLoadedPromise = new Promise((resolve) => {
    audio.addEventListener("loadedmetadata", () => {
      resolve()
    })
  })

  audio.src = dataUri
  await metadataLoadedPromise
  scheduleDjAudio()
}

async function scheduleDjAudio(state = null) {
  if (djAudioPending) return
  let duration, progress
  window.clearTimeout(djAudioTimeout)
  if (!state) {
    if (!player) {
      console.log(
        "Aborted scheduling next DJ audio: no player instance available."
      )
      return
    }
    let currentState = await player.player.getCurrentState()
    duration = currentState?.duration
    progress = currentState?.position
  } else {
    duration = state.track.durationMs
    progress = state.progressMs
  }
  if (!duration || !audio?.duration) {
    console.log(
      "Aborted scheduling next DJ audio: no current track duration or DJ audio duration available."
    )
    return
  }
  djAudioTimeout = setTimeout(() => {
    audio.play()
  }, duration - progress - (audio?.duration && (audio?.duration * 1000) / 2))
}

const getPlayer = async (playerInstance) => {
  player = { player: await playerInstance }
}

const spotifyEventHandler = (state) => {
  //state.type = track_update, player_update, status_update, progress_update"
  //key state props = isActive, isPlaying, needsUpdate, progressMs, status, track (obj), type

  console.log(state)

  if (state.type === "track_update") {
    if (store.getState().user.details.accessToken) {
      store.dispatch(fetchQueueTracks())
    }

    if (!audio || !audio.src || audio.paused) {
      prepareNextDjAudio()
    }
  }

  if (state.type === "player_update") {
    if (state.isPlaying && state.progressMs > 100) {
      scheduleDjAudio(state)
    } else {
      window.clearTimeout(djAudioTimeout)
    }
  }

  if (state.type === "progress_update") {
    scheduleDjAudio(state)
  }
}

const Player = ({ accessToken, trackUris }) => {
  if (!accessToken) return null

  return (
    <SpotifyPlayer
      getPlayer={getPlayer}
      token={accessToken}
      showSaveIcon
      callback={spotifyEventHandler}
      play={false}
      uris={trackUris ? trackUris : []}
      initialVolume={0.5}
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

export default Player
