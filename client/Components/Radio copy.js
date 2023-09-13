import React from "react"
import { useEffect } from "react"
import PlayerClass from "./PlayerClass"
import { Container } from "react-bootstrap"
import SpotifyWebApi from "spotify-web-api-node"
import { useDispatch, useSelector } from "react-redux"
import { fetchStations, fetchUserStations } from "../store/tunerSlice"

export default function Radio() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const accessToken = user?.details?.accessToken

  const spotifyApi = new SpotifyWebApi({
    clientId: "31c41df5075e46c48c3547d709102476",
  })

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

  return (
    <>
      <Container className="bg-dark d-flex flex-column py-3 justify-content-between">
        <PlayerClass accessToken={accessToken} />
      </Container>
    </>
  )
}
