import React, { Component } from "react"
import { connect } from "react-redux"
import SpotifyWebApi from "spotify-web-api-node"
import SpotifyPlayer from "react-spotify-web-playback"
import { fetchQueueTracks } from "../store/playlistSlice"
import axios from "axios"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"

export class PlayerClass extends Component {
  constructor(props) {
    super(props)
    this.state = { playSpotify: false, isAllMuted: false }
    this.audio = new Audio()
    this.djAudioTimeout = null
    this.djAudioPending = false
    this.player = { player: null }
    this.maxVoiceOverDuration = 10000
    this.muteReturnToDjVol = 1
    this.muteReturnToSpotifyVol = 1
    this.spotifyApi = new SpotifyWebApi()
    this.getPlayer = this.getPlayer.bind(this)
    this.spotifyEventHandler = this.spotifyEventHandler.bind(this)
    this.prepareNextDjAudio = this.prepareNextDjAudio.bind(this)
    this.scheduleDjAudio = this.scheduleDjAudio.bind(this)
    this.audioPlayHandler = this.audioPlayHandler.bind(this)
    this.audioEndedHandler = this.audioEndedHandler.bind(this)
    this.increaseDjVolume = this.increaseDjVolume.bind(this)
    this.decreaseDjVolume = this.decreaseDjVolume.bind(this)
    this.increaseSpotifyVolume = this.increaseSpotifyVolume.bind(this)
    this.decreaseSpotifyVolume = this.decreaseSpotifyVolume.bind(this)
    this.toggleMuteAll = this.toggleMuteAll.bind(this)
    this.getUsersPlaylists = this.getUsersPlaylists.bind(this)
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
    if (this.player && !this.state.isAllMuted)
      this.player?.player?.setVolume(0.25)
  }

  audioEndedHandler = () => {
    console.log("Audio ended")
    if (this.player && !this.state.isAllMuted) this.player?.player?.setVolume(1)
    this.prepareNextDjAudio()
  }

  async prepareNextDjAudio() {
    this.djAudioPending = true

    const playlist = this.props.reduxState.playlist.tracks
    console.log("Redux Playlist", playlist)

    // const dataUri = await axios.post("/api/content/next-content", playlist);
    // console.log(dataUri);
    //TODO: Fix with call to server to get next audio file

    const metadataLoadedPromise = new Promise((resolve) => {
      this.audio.addEventListener("loadedmetadata", () => {
        resolve()
      })
    })

    // this.audio.src = dataUri.data;

    this.audio.src =
      "audio/ElevenLabs_2023-09-01T23_59_37_Donny - very deep_gen_s50_sb75_se0_b_m2.mp3"

    await metadataLoadedPromise

    this.djAudioPending = false
    this.scheduleDjAudio()
  }

  getPlayer = async (playerInstance) => {
    this.player = { player: await playerInstance }
    this.player?.player?.setName("WYOU Radio")
  }

  spotifyEventHandler = (state) => {
    console.log(state)

    if (state.type === "track_update") {
      if (this.props.accessToken) {
        this.props.fetchQueueTracks()
      }

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
      console.log("Current state:", currentState)
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

  increaseDjVolume() {
    if (this.audio) {
      if (this.audio.volume < 1) {
        this.audio.volume = Math.min(this.audio.volume + 0.1, 1)
        console.log("Increased DJ volume to", this.audio.volume.toFixed(1))
      }
    }
  }

  decreaseDjVolume() {
    if (this.audio) {
      if (this.audio.volume > 0) {
        this.audio.volume = Math.max(this.audio.volume - 0.1, 0)
        console.log("Decreased DJ volume to", this.audio.volume.toFixed(1))
      }
    }
  }

  async increaseSpotifyVolume() {
    try {
      const currentVolume = await this.player.player.getVolume()
      if (currentVolume < 1) {
        const newVolume = Math.min(currentVolume + 0.1, 1)
        await this.player.player.setVolume(newVolume)
        console.log("Increased Spotify volume to", newVolume.toFixed(1))
      }
    } catch (error) {
      console.error("Error changing Spotify volume", error)
    }
  }

  async decreaseSpotifyVolume() {
    try {
      const currentVolume = await this.player.player.getVolume()
      if (currentVolume > 0) {
        const newVolume = Math.max(currentVolume - 0.1, 0)
        await this.player.player.setVolume(newVolume)
        console.log("Decreased Spotify volume to", newVolume.toFixed(1))
      }
    } catch (error) {
      console.error("Error changing Spotify volume", error)
    }
  }

  async toggleMuteAll() {
    const { isAllMuted } = this.state
    this.setState({ isAllMuted: !isAllMuted }, async () => {
      const preMuteDjVol = this.audio?.volume
      const preMuteSpotifyVol = await this.player?.player?.getVolume()
      if (!isAllMuted) {
        this.audio.volume = 0
        await this.player?.player?.setVolume(0)
      } else {
        this.audio.volume = this.muteReturnToDjVol
        await this.player?.player?.setVolume(this.muteReturnToSpotifyVol)
      }

      this.muteReturnToDjVol = preMuteDjVol
      this.muteReturnToSpotifyVol = preMuteSpotifyVol
    })
  }

  async getUsersPlaylists() {
    this.spotifyApi.setAccessToken(this.props.accessToken)
    let data = await this.spotifyApi.getUserPlaylists()
    console.log("User's Playlists: ", data.body.items)
    data = await this.spotifyApi.getFeaturedPlaylists({
      limit: 5,
      offset: 0,
      country: "US",
    })
    console.log("Featured Playlists: ", data.body.playlists.items)
    data = await this.spotifyApi.searchPlaylists("classic rock")
    console.log("Search Classic Rock Playlists: ", data.body.playlists.items)
  }

  render() {
    let { accessToken, trackUris } = this.props

    if (!accessToken) return null
    return (
      <>
        <Container className="">
          <Button
            className={`m-1 ${
              this.state.isAllMuted ? "btn-danger" : "btn-primary"
            }`}
            onClick={this.toggleMuteAll}
          >
            Toggle Mute All
          </Button>
          <Button className="m-1" onClick={this.getUsersPlaylists}>
            Log Playlists
          </Button>
        </Container>
        <Container className="">
          <Button className="m-1" onClick={() => this.audio?.play()}>
            Play DJ Track
          </Button>
          <Button className="m-1" onClick={() => this.audio?.pause()}>
            Pause DJ Track
          </Button>
          <Button className="m-1" onClick={this.increaseDjVolume}>
            Vol Up
          </Button>
          <Button className="m-1" onClick={this.decreaseDjVolume}>
            Vol Down
          </Button>
        </Container>
        <Container className="mb-2">
          <Button
            className="m-1"
            onClick={() => this.setState({ playSpotify: true })}
          >
            Load Music
          </Button>
          <Button
            className="m-1"
            onClick={() => this.player?.player?.togglePlay()}
          >
            Toggle Music
          </Button>
          <Button className="m-1" onClick={() => this.player?.player?.pause()}>
            Pause Music
          </Button>
          <Button className="m-1" onClick={() => this.player?.player?.resume()}>
            Resume Music
          </Button>
          <Button
            className="m-1"
            onClick={() => this.player?.player?.previousTrack()}
          >
            Previous
          </Button>
          <Button
            className="m-1"
            onClick={() => this.player?.player?.nextTrack()}
          >
            Next
          </Button>
          <Button className="m-1" onClick={this.increaseSpotifyVolume}>
            Vol Up
          </Button>
          <Button className="m-1" onClick={this.decreaseSpotifyVolume}>
            Vol Down
          </Button>
        </Container>
        <SpotifyPlayer
          getPlayer={this.getPlayer}
          token={accessToken}
          showSaveIcon
          callback={this.spotifyEventHandler}
          play={this.state.playSpotify}
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
      </>
    )
  }
}

const mapStateToProps = (reduxState) => ({
  reduxState: reduxState,
})

const mapDispatchToProps = (dispatch) => ({
  fetchQueueTracks: () => dispatch(fetchQueueTracks()),
})

export default connect(mapStateToProps, mapDispatchToProps)(PlayerClass)
