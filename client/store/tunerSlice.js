import { createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import SpotifyWebApi from "spotify-web-api-node"

const spotifyApi = new SpotifyWebApi()

const initialState = {
  stations: [],
  currentStation: null,
  loading: false,
  error: null,
}

const tunerSlice = createSlice({
  name: "tuner",
  initialState,
  reducers: {
    addStation: (state, action) => {
      state.stations.push(action.payload)
    },
    addStations: (state, action) => {
      state.stations = [...state.stations, ...action.payload]
    },
    removeStation: (state, action) => {
      state.stations = state.stations.filter(
        (station) => station.id !== action.payload.id
      )
    },
    clearStations: (state) => {
      state.stations = []
    },
    setStationsLoading: (state, action) => {
      state.loading = action.payload
    },
    setStationsError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const {
  addStation,
  addStations,
  removeStation,
  clearStations,
  setStationsLoading,
  setStationsError,
} = tunerSlice.actions

export const fetchStations = (uriArray) => async (dispatch, getState) => {
  try {
    if (!getState().user.details.accessToken) return
    spotifyApi.setAccessToken(getState().user.details.accessToken)
    const stationArray = await Promise.all(
      uriArray.map(async (uri) => {
        const res = await spotifyApi.getPlaylist(uri)
        return res.body
      })
    )

    dispatch(addStations(stationArray))
    // dispatch(setStationsLoading(true))
  } catch (error) {
    dispatch(setStationsError(error))
  } finally {
    dispatch(setStationsLoading(false))
  }
}

export const fetchUserStations = () => async (dispatch, getState) => {
  try {
    if (!getState().user.details.accessToken) return
    spotifyApi.setAccessToken(getState().user.details.accessToken)
    const res = await spotifyApi.getUserPlaylists()
    dispatch(addStations(res.body.items))
  } catch (error) {
    dispatch(setStationsError(error))
  } finally {
    dispatch(setStationsLoading(false))
  }
}

export default tunerSlice.reducer
