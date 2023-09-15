import { createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import SpotifyWebApi from "spotify-web-api-node"

const spotifyApi = new SpotifyWebApi()

const initialState = {
  allStations: [],
  currentStation: null,
  loading: false,
  error: null,
}

const stationsSlice = createSlice({
  name: "stations",
  initialState,
  reducers: {
    addStation: (state, action) => {
      if (
        !state.allStations.find((station) => station.id === action.payload.id)
      ) {
        state.allStations.push(action.payload)
      }
    },
    addStations: (state, action) => {
      state.allStations = [...state.allStations, ...action.payload]
    },
    removeStation: (state, action) => {
      state.allStations = state.allStations.filter(
        (station) => station.id !== action.payload.id
      )
    },
    clearStations: (state) => {
      state.allStations = []
    },
    setStationsLoading: (state, action) => {
      state.loading = action.payload
    },
    setStationsError: (state, action) => {
      state.error = action.payload
    },
    setCurrentStation: (state, action) => {
      state.currentStation = action.payload
    },
    clearCurrentStation: (state) => {
      state.currentStation = null
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
  setCurrentStation,
  clearCurrentStation,
} = stationsSlice.actions

export const fetchStations = (uriArray) => async (dispatch, getState) => {
  try {
    if (!getState().user.details.accessToken) return
    dispatch(setStationsLoading(true))

    spotifyApi.setAccessToken(getState().user.details.accessToken)
    const stationArray = await Promise.all(
      uriArray.map(async (uri) => {
        const res = await spotifyApi.getPlaylist(uri)
        return res.body
      })
    )

    dispatch(addStations(stationArray))
  } catch (error) {
    dispatch(setStationsError(error))
  } finally {
    dispatch(setStationsLoading(false))
  }
}

export const fetchStation = (uri) => async (dispatch, getState) => {
  try {
    if (!getState().user.details.accessToken) return
    dispatch(setStationsLoading(true))

    spotifyApi.setAccessToken(getState().user.details.accessToken)
    const res = await spotifyApi.getPlaylist(uri)
    dispatch(addStation(res.body))
  } catch (error) {
    dispatch(setStationsError(error))
  } finally {
    dispatch(setStationsLoading(false))
  }
}

export const setCurrentStationByUri = (uri) => async (dispatch, getState) => {
  try {
    if (!getState().user.details.accessToken) return
    dispatch(setStationsLoading(true))

    spotifyApi.setAccessToken(getState().user.details.accessToken)
    const res = await spotifyApi.getPlaylist(uri)
    dispatch(setCurrentStation(res.body))
  } catch (error) {
    dispatch(setStationsError(error))
  } finally {
    dispatch(setStationsLoading(false))
  }
}

export const fetchUserStations = () => async (dispatch, getState) => {
  try {
    if (!getState().user.details.accessToken) return
    dispatch(setStationsLoading(true))

    spotifyApi.setAccessToken(getState().user.details.accessToken)
    const res = await spotifyApi.getUserPlaylists()
    dispatch(addStations(res.body.items))
  } catch (error) {
    dispatch(setStationsError(error))
  } finally {
    dispatch(setStationsLoading(false))
  }
}

export default stationsSlice.reducer
