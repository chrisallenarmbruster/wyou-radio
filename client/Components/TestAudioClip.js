import React, { useState } from "react"
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"

function TestAudioClip() {
  const audioUrl = "audio/opening-title.mp3" // Replace with your audio URL
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5) // Initialize the volume to 0.5 (50% volume)
  const audioRef = React.createRef()

  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value
    audioRef.current.volume = newVolume
    setVolume(newVolume)
  }

  return (
    <Container className="my-5 text-light">
      <hr />
      <audio ref={audioRef} src={audioUrl}></audio>
      <p>Play a separate audio track simultaneously (non-Spotify):</p>
      <div className="d-flex align-items-center px-5">
        <Button className="me-5" onClick={toggleAudio}>
          {isPlaying ? "Pause" : "Play"}
        </Button>
        Volume:
        <Form.Range
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="ms-2"
        />
      </div>
      <hr />
    </Container>
  )
}

export default TestAudioClip
