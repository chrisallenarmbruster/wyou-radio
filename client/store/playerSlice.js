import { createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
  currentTrack: null,
  loading: false,
  error: null,
}

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setCurrentTrack: (state, action) => {
      state.currentTrack = action.payload
    },
    clearCurrentTrack: (state) => {
      state.currentTrack = null
    },
    setPlayerLoading: (state, action) => {
      state.loading = action.payload
    },
    setPlayerError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const {
  setCurrentTrack,
  setPlayerLoading,
  setPlayerError,
  clearCurrentTrack,
} = playerSlice.actions

export default playerSlice.reducer
