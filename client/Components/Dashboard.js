import React from "react"
import { useState, useEffect } from "react"
import useAuth from "./useAuth"
import Player from "./Player"
import WebPlayback from "./WebPlayback"
import TrackSearchResult from "./TrackSearchResult"
import { Container, Form } from "react-bootstrap"
import SpotifyWebApi from "spotify-web-api-node"
import TestAudioClip from "./TestAudioClip"
import { useDispatch, useSelector } from "react-redux"
import {
  addTrack,
  addTracks,
  removeTrack,
  clearPlaylist,
  fetchPlaylistTracks,
} from "../store/playlistSlice"
import store from "../store"

export default function Dashboard({ code }) {
  const dispatch = useDispatch()
  const playlist = useSelector((state) => state.playlist)
  const accessToken = useAuth(code)
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [playingTrack, setPlayingTrack] = useState()
  const [lyrics, setLyrics] = useState("")

  const spotifyApi = new SpotifyWebApi({
    clientId: "31c41df5075e46c48c3547d709102476",
  })

  function chooseTrack(track) {
    dispatch(addTrack(track))
    setPlayingTrack([track])
    setSearch("")
    setLyrics("")
  }

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
    const playlistId = "6WESoRu7keGwiyag0owvuV"
    dispatch(fetchPlaylistTracks(playlistId, accessToken))
  }, [!!accessToken])

  useEffect(() => {
    if (!search) return setSearchResults([])
    if (!accessToken) return

    let cancel = false
    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return
      setSearchResults(
        res.body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image
              return smallest
            },
            track.album.images[0]
          )

          return {
            title: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            duration: track.duration_ms,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
            id: track.id,
          }
        })
      )
    })

    return () => (cancel = true)
  }, [search, accessToken])

  return (
    <>
      <Container
        className="bg-dark d-flex flex-column py-3"
        style={{ height: "90vh" }}
      >
        <Form.Control
          type="search"
          placeholder="Search Songs/Artists"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2"
        />
        <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
          {searchResults.map((track) => (
            <TrackSearchResult
              track={track}
              key={track.uri}
              chooseTrack={chooseTrack}
            />
          ))}
          {searchResults.length === 0 && (
            <div className="text-center" style={{ whiteSpace: "pre" }}>
              {lyrics}
            </div>
          )}
        </div>
        <div>
          <TestAudioClip />
        </div>
        <div>
          {/* <Player accessToken={accessToken} trackUri={playingTrack?.uri} /> */}
          <Player
            spotifyApi={spotifyApi}
            accessToken={accessToken}
            trackUris={
              playlist ? playlist.tracks.map((track) => track.uri) : null
            }
          />
          {/* {accessToken ? (
            <WebPlayback
              token={accessToken}
              trackUris={["spotify:playlist:6WESoRu7keGwiyag0owvuV"]}
            />
          ) : (
            <div>loading</div>
          )} */}
        </div>
      </Container>
    </>
  )
}
