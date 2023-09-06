import React, { Component } from "react"
import { connect } from "react-redux"
import SpotifyPlayer from "react-spotify-web-playback"
import { fetchQueueTracks } from "../store/playlistSlice"
import store from "../store"

export class PlayerClass extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.audio = new Audio()
    this.djAudioTimeout = null
    this.djAudioPending = false
    this.player = { player: null }
    this.maxVoiceOverDuration = 10000
    this.getPlayer = this.getPlayer.bind(this)
    this.spotifyEventHandler = this.spotifyEventHandler.bind(this)
    this.prepareNextDjAudio = this.prepareNextDjAudio.bind(this)
    this.scheduleDjAudio = this.scheduleDjAudio.bind(this)
    this.audioPlayHandler = this.audioPlayHandler.bind(this)
    this.audioEndedHandler = this.audioEndedHandler.bind(this)
  }

  componentDidMount = () => {
    console.log("PlayerClass mounted")

    this.audio.addEventListener("play", this.audioPlayHandler)
    this.audio.addEventListener("ended", this.audioEndedHandler)
  }

  componentWillUnmount = () => {
    console.log("PlayerClass unmounted")
    this.audio?.pause()
    window.clearTimeout(this.djAudioTimeout)
    this.audio?.removeEventListener("play", this.audioPlayHandler)
    this.audio?.removeEventListener("ended", this.audioEndedHandler)
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.trackUris !== this.props.trackUris) {
      console.log("PlayerClass updated")
    }
  }

  audioPlayHandler = () => {
    console.log("Audio started playing")
    if (this.player) this.player?.player?.setVolume(0.25)
  }

  audioEndedHandler = () => {
    console.log("Audio ended")
    if (this.player) this.player?.player?.setVolume(1)
    this.prepareNextDjAudio()
  }

  async prepareNextDjAudio() {
    this.djAudioPending = true

    const dataUri =
      "audio/ElevenLabs_2023-09-01T23_59_37_Donny - very deep_gen_s50_sb75_se0_b_m2.mp3"

    const metadataLoadedPromise = new Promise((resolve) => {
      this.audio.addEventListener("loadedmetadata", () => {
        resolve()
      })
    })

    this.audio.src = dataUri
    await metadataLoadedPromise

    this.djAudioPending = false
    this.scheduleDjAudio()
  }

  getPlayer = async (playerInstance) => {
    this.player = { player: await playerInstance }
  }

  spotifyEventHandler = (state) => {
    console.log(state)

    if (state.type === "track_update") {
      // if (store.getState().user.details.accessToken) {
      //   store.dispatch(fetchQueueTracks())
      // }

      if (!this.audio || !this.audio.src || this.audio.paused) {
        this.prepareNextDjAudio()
      }
    }

    if (state.type === "player_update") {
      if (state.isPlaying && state.progressMs > 100) {
        this.scheduleDjAudio(state)
      } else {
        window.clearTimeout(this.djAudioTimeout)
      }
    }

    if (state.type === "progress_update") {
      this.scheduleDjAudio(state)
    }
  }

  async scheduleDjAudio(state = null) {
    if (this.djAudioPending) return
    let duration, progress
    window.clearTimeout(this.djAudioTimeout)
    if (!state) {
      if (!this.player) {
        console.log(
          "Aborted scheduling next DJ audio: no player instance available."
        )
        return
      }
      let currentState = await this.player.player.getCurrentState()
      duration = currentState?.duration
      progress = currentState?.position
    } else {
      duration = state.track.durationMs
      progress = state.progressMs
    }
    if (!duration || !this.audio?.duration) {
      console.log(
        "Aborted scheduling next DJ audio: no current track duration or DJ audio duration available."
      )
      return
    }
    this.djAudioTimeout = setTimeout(() => {
      this.audio.play()
    }, duration - progress - (this.audio?.duration && (this.audio?.duration * 1000) / 2))
  }

  render() {
    let { accessToken, trackUris } = this.props
    console.log("PlayerClass rendered", this.props)
    if (!accessToken) return null
    return (
      <SpotifyPlayer
        getPlayer={this.getPlayer}
        token={accessToken}
        showSaveIcon
        callback={this.spotifyEventHandler}
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
}

const mapStateToProps = (reduxState) => ({
  reduxState: reduxState,
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerClass)
