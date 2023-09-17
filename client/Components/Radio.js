import React, { Component } from "react"
import { connect } from "react-redux"
import SpotifyWebApi from "spotify-web-api-node"
import SpotifyPlayer from "react-spotify-web-playback"
import { spotifyApi as spotifyApiImports } from "react-spotify-web-playback"
import axios from "axios"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import DiscJockeys from "./DiscJockeys"
import Player from "./Player"
import Stations from "./Stations"
import {
  fetchStations,
  fetchUserStations,
  setCurrentStationByUri,
} from "../store/stationsSlice"
import { fetchDjs } from "../store/djsSlice"
import { setCurrentTrack } from "../store/playerSlice"
import { Routes, Route } from "react-router-dom"
import { Link } from "react-router-dom"
import Form from "react-bootstrap/Form"
import { setCurrentDj } from "../store/djsSlice"

export class Radio extends Component {
  constructor(props) {
    super(props)
    this.state = {
      playSpotify: false,
      isAllMuted: false,
      deviceId: null,
      showDevTools: false,
      pauseButton: false,
      masterVolumeSetting: 0.7,
      djOnAir: false,
    }
    this.player = { player: null }
    this.audio = new Audio()
    this.djAudioTimeout = null
    this.delayNextTrackTimeout = null
    this.delayNextTrack = false
    this.trackDelaySet = false
    this.djAudioPending = false
    this.needNextDjAudio = true
    this.isSpotifyPlaying = false
    this.maxVoiceOverDuration = 20000
    this.spotifyVolAttenuation = 0.5
    this.spotifyApi = new SpotifyWebApi()
    this.getPlayer = this.getPlayer.bind(this)
    this.spotifyEventHandler = this.spotifyEventHandler.bind(this)
    this.prepareNextDjAudio = this.prepareNextDjAudio.bind(this)
    this.scheduleDjAudio = this.scheduleDjAudio.bind(this)
    this.audioPlayHandler = this.audioPlayHandler.bind(this)
    this.audioEndedHandler = this.audioEndedHandler.bind(this)
    this.toggleMuteAll = this.toggleMuteAll.bind(this)
    this.playTrack = this.playTrack.bind(this)
    this.addTrack = this.addTrack.bind(this)
    this.playContext = this.playContext.bind(this)
    this.showQueue = this.showQueue.bind(this)
    this.setDevice = this.setDevice.bind(this)
    this.toggleShowDevTools = this.toggleShowDevTools.bind(this)
    this.masterVolumeHandler = this.masterVolumeHandler.bind(this)
    this.selectDj = this.selectDj.bind(this)
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
    if (prevState.deviceId !== this.state.deviceId) {
      console.log("Device ID updated", this.state.deviceId)
      if (this.state.deviceId) this.setDevice()
    }

    if (prevState.masterVolumeSetting !== this.state.masterVolumeSetting) {
      if (!this.state.isAllMuted) {
        this.audio.volume = this.state.masterVolumeSetting
        if (!this.audio?.paused) {
          this.player?.player?.setVolume(
            this.state.masterVolumeSetting * this.spotifyVolAttenuation
          )
        } else {
          this.player?.player?.setVolume(this.state.masterVolumeSetting)
        }
      }
    }
  }

  audioPlayHandler = () => {
    console.log("Audio started playing")
    this.setState({ djOnAir: true })
    if (this.player && !this.state.isAllMuted)
      this.player?.player?.setVolume(
        this.state.masterVolumeSetting * this.spotifyVolAttenuation
      )
  }

  audioEndedHandler = () => {
    console.log("Audio ended")
    this.setState({ djOnAir: false })
    if (this.player && !this.state.isAllMuted)
      this.player?.player?.setVolume(this.state.masterVolumeSetting)
    this.prepareNextDjAudio()
  }

  async prepareNextDjAudio() {
    console.log("prepareNextDjAudio called.  Analyzing what to do...")
    if (
      this.needNextDjAudio &&
      !this.djAudioPending &&
      this.isSpotifyPlaying &&
      (!this.audio || this.audio.paused)
    ) {
      console.log("Going to retrieve next DJ audio from server.")
      this.djAudioPending = true

      const trackState = (await this.player?.player?.getCurrentState())
        .track_window

      const payload = {}
      payload.jamSessionId = this.props.jamSession.id
      payload.djName = this.props.currentDj?.djName
      payload.djId = this.props.currentDj?.id
      payload.station = {
        name: this.props.currentStation?.name,
        description: this.props.currentStation?.description,
        uri: this.props.currentStation?.uri,
      }
      payload.curTrack = {
        uri: trackState.current_track.uri,
        name: trackState.current_track.name,
        artist: trackState.current_track.artists[0].name,
      }
      if (trackState.next_tracks.length > 0) {
        payload.nextTrack = {
          uri: trackState.next_tracks[0].uri,
          name: trackState.next_tracks[0].name,
          artist: trackState.next_tracks[0].artists[0].name,
        }
      }

      let dataUri
      //uncomment following line when ready to test with backend
      // dataUri = await axios.post("/api/content/next-content", payload);

      const metadataLoadedPromise = new Promise((resolve) => {
        this.audio.addEventListener("loadedmetadata", () => {
          resolve()
        })
      })

      this.audio.src =
        dataUri?.data ||
        "audio/ElevenLabs_2023-09-01T23_59_37_Donny - very deep_gen_s50_sb75_se0_b_m2.mp3"
      // "audio/opening-title.mp3"

      await metadataLoadedPromise

      this.needNextDjAudio = false
      this.djAudioPending = false
    } else {
      console.log(
        `Doesn't look like I should retrieve next audio at this time because one of these is false: needNextDjAudio: ${
          this.needNextDjAudio
        }, !djAudioPending: ${!this.djAudioPending}, isSpotifyPlaying: ${
          this.isSpotifyPlaying
        }, !audio || this.audio?.paused: ${!this.audio || this.audio?.paused}.`
      )
    }
    if (this.isSpotifyPlaying && this.audio.paused && !this.djAudioPending) {
      console.log("Looks like I should schedule DJ audio.")
      this.scheduleDjAudio()
    } else {
      console.log(
        `Doesn't look like I should schedule DJ audio because one of these is false: isSpotifyPlaying: ${
          this.isSpotifyPlaying
        }, DJ is not Talking: ${this.audio.paused}, !djAudioPending: ${!this
          .djAudioPending}`
      )
    }
  }

  getPlayer = async (playerInstance) => {
    console.log("Got player instance:", await playerInstance)
    this.player = { player: await playerInstance }
    await this.player?.player?.setName("WYOU Radio")
  }

  spotifyEventHandler = async (state) => {
    console.log(state)
    this.setState({ pauseButton: state.isPlaying })

    if (state.type === "status_update") {
      this.setState({ deviceId: state.currentDeviceId })
    }

    if (state.type === "track_update") {
      this.props.setCurrentTrack(state.track)
      this.needNextDjAudio = true
      this.isSpotifyPlaying = state.isPlaying

      if (this.delayNextTrack) {
        this.trackDelaySet = true
        this.delayNextTrack = false
        console.log("Delaying next track.")
        await this.player?.player?.pause()
      }

      this.prepareNextDjAudio()
    }

    if (state.type === "player_update") {
      this.isSpotifyPlaying = state.isPlaying
      if (this.isSpotifyPlaying) {
        this.prepareNextDjAudio()
      } else {
        if (!this.trackDelaySet || state.progressMs > 50) {
          console.log("Player paused. Cancelling scheduled DJ audio (if any).")
          window.clearTimeout(this.djAudioTimeout)
          window.clearTimeout(this.delayNextTrackTimeout)
          this.delayNextTrack = false
          this.audio?.pause()
        } else {
          this.prepareNextDjAudio()
        }
      }
    }

    if (state.type === "progress_update") {
      this.isSpotifyPlaying = state.isPlaying
      this.delayNextTrack = false
      window.clearTimeout(this.djAudioTimeout)
      window.clearTimeout(this.delayNextTrackTimeout)
      if (this.isSpotifyPlaying) {
        this.audio?.pause()
        this.audio.currentTime = 0
        this.scheduleDjAudio(state)
      }
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
    let djTimeOut
    if (this.audio?.duration * 1000 > this.maxVoiceOverDuration) {
      console.log("Delaying next track.")
      this.delayNextTrack = true
      djTimeOut = duration - progress - this.maxVoiceOverDuration / 2
      this.delayNextTrackTimeout = setTimeout(() => {
        this.player?.player?.resume()
      }, djTimeOut + this.audio?.duration * 1000 - this.maxVoiceOverDuration / 2)
    } else {
      djTimeOut =
        duration -
        progress -
        (this.audio?.duration && (this.audio?.duration * 1000) / 2)
    }

    this.djAudioTimeout = setTimeout(() => {
      this.audio.play()
    }, djTimeOut)
  }

  masterVolumeHandler(e) {
    this.setState({ masterVolumeSetting: e.target.value })
    console.log("Master volume set to", e.target.value)
  }

  async toggleMuteAll() {
    const { isAllMuted } = this.state
    this.setState({ isAllMuted: !isAllMuted }, async () => {
      if (!isAllMuted) {
        this.audio.volume = 0
        await this.player?.player?.setVolume(0)
      } else {
        this.audio.volume = this.state.masterVolumeSetting
        if (!this.audio?.paused) {
          await this.player?.player?.setVolume(
            this.state.masterVolumeSetting * this.spotifyVolAttenuation
          )
        } else {
          await this.player?.player?.setVolume(this.state.masterVolumeSetting)
        }
      }
    })
  }

  async playTrack(track) {
    this.spotifyApi.setAccessToken(this.props.accessToken)
    setTimeout(async () => {
      await this.spotifyApi.play({
        uris: [track.uri],
      })
    }, 1000)
  }

  async addTrack(track) {
    this.spotifyApi.setAccessToken(this.props.accessToken)
    console.log("Adding track: ", track.uri)
    await this.spotifyApi.addToQueue(track.uri)
  }

  async playContext(context) {
    this.spotifyApi.setAccessToken(this.props.accessToken)
    this.spotifyApi.setShuffle(true)
    clearTimeout(this.djAudioTimeout)
    clearTimeout(this.delayNextTrackTimeout)
    this.delayNextTrack = false
    this.trackDelaySet = false
    this.audio?.pause()
    this.setState({ djOnAir: false })
    setTimeout(async () => {
      await this.spotifyApi.play({
        context_uri: context.uri,
      })
    }, 500)
  }

  selectDj(dj) {
    this.props.setCurrentDj(dj)
    this.audio?.pause()
    this.setState({ djOnAir: false })
  }

  async showQueue() {
    const data = await spotifyApiImports.getQueue(this.props.accessToken)
    console.log("Queue: ", data)
  }

  async setDevice() {
    await spotifyApiImports.setDevice(
      this.props.accessToken,
      this.state.deviceId,
      false
    )
    console.log(`Device set with id: ${this.state.deviceId}`)
  }

  toggleShowDevTools = () => {
    this.setState((prevState) => ({
      showDevTools: !prevState.showDevTools,
    }))
  }

  render() {
    let { trackUris } = this.props

    if (!this.props?.accessToken) return null
    return (
      <Container className="bg-dark d-flex flex-column py-3 ">
        <div className="text-center">
          <div
            className={`${
              this.props.currentDj && this.props.currentStation
                ? "visible"
                : "invisible"
            }`}
          >
            <Link to="djs" className="text-light text-decoration-none mx-3">
              Disc Jockey
            </Link>
            <Link
              to="stations"
              className="text-light text-decoration-none mx-3"
            >
              Station
            </Link>
            <Link
              to="player"
              className={`text-light text-decoration-none mx-3 ${
                this.props.currentDj && this.props.currentStation
                  ? ""
                  : "pe-none"
              }`}
            >
              Stream
            </Link>
          </div>
          <div style={{ height: "600px" }}>
            <div className="radio-panel-container">
              <div className="radio-panel">
                <Routes>
                  <Route
                    index
                    element={
                      <Stations
                        playContext={this.playContext}
                        pauseSpotify={() => this.player?.player?.pause()}
                      />
                    }
                  />
                  <Route
                    path="stations"
                    element={
                      <Stations
                        playContext={this.playContext}
                        pauseSpotify={() => this.player?.player?.pause()}
                      />
                    }
                  />
                  <Route
                    path="djs"
                    element={<DiscJockeys selectDj={this.selectDj} />}
                  />
                  <Route
                    path="player"
                    element={<Player playContext={this.playContext} />}
                  />
                </Routes>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`d-flex justify-content-center align-items-center flex-wrap ${
            this.state.djOnAir ||
            !this.props.currentDj?.djName ||
            !this.props.currentStation?.name
              ? "d-none"
              : ""
          }`}
        >
          <Button onClick={this.toggleShowDevTools} className="m-1">
            Dev Tools
          </Button>
          <Button
            className="m-1 "
            onClick={() => this.player?.player?.togglePlay()}
          >
            {this.state.pauseButton ? "Pause" : "Play"}
          </Button>
          <Button
            className="m-1 "
            onClick={() => this.player?.player?.nextTrack()}
          >
            Next
          </Button>
          <Button
            className={`m-1  ${
              this.state.isAllMuted ? "btn-danger" : "btn-primary"
            }`}
            onClick={this.toggleMuteAll}
          >
            Mute
          </Button>

          <Form.Range
            title="Master Volume"
            min={0}
            max={1}
            step={0.1}
            className="mx-3"
            value={this.state.masterVolumeSetting}
            style={{ width: "100px" }}
            onChange={(e) => this.masterVolumeHandler(e)}
          />

          {/* </span> */}
        </div>
        <div
          className={`d-flex justify-content-center align-items-center flex-wrap blink ${
            this.state.djOnAir ? "" : "d-none"
          }`}
        >
          <span className="text-danger h3">
            &lt;&lt;&lt; DJ {this.props.currentDj?.djName} is On Air
            &gt;&gt;&gt;
          </span>
        </div>

        <div className={this.state.showDevTools ? "" : "d-none"}>
          <>
            <Container className="text-center mt-5">
              <Button className="m-1" onClick={() => this.audio?.play()}>
                Play DJ Track
              </Button>
              <Button className="m-1" onClick={() => this.audio?.pause()}>
                Pause DJ Track
              </Button>

              <Button className="m-1" onClick={() => this.showQueue()}>
                Queue
              </Button>
              <Button
                className="m-1"
                onClick={() => this.player?.player?.togglePlay()}
              >
                Toggle Music
              </Button>
              <Button
                className="m-1"
                onClick={() => this.player?.player?.pause()}
              >
                Pause Music
              </Button>
              <Button
                className="m-1"
                onClick={() => this.player?.player?.resume()}
              >
                Resume Music
              </Button>
              <Button
                className="m-1"
                onClick={() => this.player?.player?.previousTrack()}
              >
                Prev
              </Button>
              <Button
                className="m-1"
                onClick={() => this.player?.player?.nextTrack()}
              >
                Next
              </Button>
            </Container>
          </>

          <SpotifyPlayer
            getPlayer={this.getPlayer}
            token={this.props?.accessToken}
            // uris={[this.props.currentStation?.uri] || []}
            offset={0}
            callback={this.spotifyEventHandler}
            play={this.state.playSpotify}
            // play={true}
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
        </div>
      </Container>
    )
  }
}

const mapStateToProps = (reduxState) => ({
  reduxState: reduxState,
  jamSession: reduxState.jamSession,
  accessToken: reduxState.user?.details?.accessToken,
  currentStation: reduxState.stations.currentStation,
  currentDj: reduxState.djs.currentDj,
})

const mapDispatchToProps = (dispatch) => ({
  fetchStations: (stationIds) => dispatch(fetchStations(stationIds)),
  fetchUserStations: () => dispatch(fetchUserStations()),
  setCurrentStationByUri: (uri) => dispatch(setCurrentStationByUri(uri)),
  fetchDjs: () => dispatch(fetchDjs()),
  setCurrentTrack: (track) => dispatch(setCurrentTrack(track)),
  setCurrentDj: (dj) => dispatch(setCurrentDj(dj)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Radio)
