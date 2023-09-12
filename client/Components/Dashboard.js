import React from "react"
import { useState, useEffect } from "react"
import useAuth from "./useAuth"
import PlayerClass from "./PlayerClass"
import TrackSearchResult from "./TrackSearchResult"
import { Container, Form } from "react-bootstrap"
import SpotifyWebApi from "spotify-web-api-node"
import { useDispatch, useSelector } from "react-redux"
import { fetchStations, fetchUserStations } from "../store/tunerSlice"

export default function Dashboard({ code }) {
  const dispatch = useDispatch()
  const accessToken = useAuth(code)
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [playingTrack, setPlayingTrack] = useState()
  const [lyrics, setLyrics] = useState("")

  const spotifyApi = new SpotifyWebApi({
    clientId: "31c41df5075e46c48c3547d709102476",
  })

  function addTrack(track) {
    //need to replace with "Listen" to station aka playlist
    setPlayingTrack([track])
    setSearch("")
    setLyrics("")
  }

  function playTrack(track) {
    //need to replace with "Listen" to station aka playlist
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
    dispatch(
      fetchStations([
        "37i9dQZF1DWXRqgorJj26U",
        "37i9dQZF1DXaJXCbmtHVHV",
        "37i9dQZF1DX2sQHbtx0sdt",
        "37i9dQZF1DXbcP8BbYEQaO",
        "37i9dQZF1DWUajed02NzWR",
      ])
    )
    dispatch(fetchUserStations())
    return
  }, [!!accessToken])

  useEffect(() => {
    //need to refactor to search for playlists, albums and artists as opposed to tracks
    if (!search) return setSearchResults([])
    if (!accessToken) return

    spotifyApi.setAccessToken(accessToken)
    spotifyApi.searchTracks(search).then((res) => {
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
            type: track.type,
          }
        })
      )
    })
    return
  }, [search, accessToken])

  return (
    <>
      <Container className="bg-dark d-flex flex-column py-3 justify-content-between">
        {/* {accessToken && (
          <>
            <Form.Control
              type="search"
              placeholder="Search Stations/Playlists"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2"
              disabled={true}
            />
            <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
              {searchResults.map((track) => (
                <TrackSearchResult
                  track={track}
                  key={track.uri}
                  playTrack={playTrack}
                  addTrack={addTrack}
                />
              ))}
              {searchResults.length === 0 && (
                <div className="text-center" style={{ whiteSpace: "pre" }}>
                  {lyrics}
                </div>
              )}
            </div>
          </>
        )} */}

        <div>
          <PlayerClass accessToken={accessToken} />
        </div>
      </Container>
    </>
  )
}
