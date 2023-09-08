import { createSlice } from "@reduxjs/toolkit"
import SpotifyWebApi from "spotify-web-api-node"

const spotifyApi = new SpotifyWebApi()

const initialState = {
  spotifyUris: [],
}

const playerUriListSlice = createSlice({
  name: "playerUriList",
  initialState,
  reducers: {
    setPlayerUriList: (state, action) => {
      state.spotifyUris = action.payload
    },
    clearPlayerUriList: (state) => {
      state.spotifyUris = []
    },
    addToPlayerUriList: (state, action) => {
      state.spotifyUris.push(action.payload)
    },
    removeFromPlayerUriList: (state, action) => {
      state.spotifyUris = state.spotifyUris.filter(
        (uri) => uri.id !== action.payload.id
      )
    },
  },
})

export const {
  setPlayerUriList,
  clearPlayerUriList,
  addToPlayerUriList,
  removeFromPlayerUriList,
} = playerUriListSlice.actions

export const addUriToPlayer = (uri) => async (dispatch, getState) => {
  try {
    if (!getState().user.details.accessToken) return
    spotifyApi.setAccessToken(getState().user.details.accessToken)
    const res = await spotifyApi.getPlaylist(uri)
    dispatch(addToPlayerUriList(res.body))
  } catch (error) {
    console.log(error)
  }
}

export default playerUriListSlice.reducer
