import { createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
  allDjs: [],
  currentDj: null,
  loading: false,
  error: null,
}

const djsSlice = createSlice({
  name: "djs",
  initialState,
  reducers: {
    addDj: (state, action) => {
      state.allDjs.push(action.payload)
    },
    addDjs: (state, action) => {
      state.allDjs = [...state.allDjs, ...action.payload]
    },
    removeDj: (state, action) => {
      state.allDjs = state.allDjs.filter((dj) => dj.id !== action.payload.id)
    },
    clearDjs: (state) => {
      state.allDjs = []
    },
    setCurrentDj: (state, action) => {
      state.currentDj = action.payload
    },
    setDjLoading: (state, action) => {
      state.loading = action.payload
    },
    setDjError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const {
  addDj,
  addDjs,
  removeDj,
  clearDjs,
  setCurrentDj,
  setDjLoading,
  setDjError,
} = djsSlice.actions

export const fetchDjs = () => async (dispatch, getState) => {
  try {
    dispatch(setDjLoading(true))

    // need axios call here to the backend to retrieve all DJs
    const data = [
      { djName: "Garth Brooks" },
      { djName: "Snoop Dogg" },
      { djName: "Martha Quinn" },
      { djName: "Mr. Rogers" },
    ]

    const response = await axios.get("api/content/dj-characters")
    console.log("get djs", response.data)

    dispatch(addDjs(data))
  } catch (error) {
    dispatch(setDjError(error.message))
  } finally {
    dispatch(setDjLoading(false))
  }
}

export default djsSlice.reducer
