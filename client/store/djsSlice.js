import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  allDjs: [],
  currentDj: null,
  loading: false,
  error: null,
}

const djsSlice = createSlice({
  name: 'djs',
  initialState,
  reducers: {
    addDj: (state, action) => {
      state.allDjs.push(action.payload)
    },
    addDjs: (state, action) => {
      state.allDjs = [...state.allDjs, ...action.payload]
    },
    setDjs: (state, action) => {
      state.allDjs = action.payload
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
  setDjs,
  setDjLoading,
  setDjError,
} = djsSlice.actions

export const fetchDjs = () => async (dispatch, getState) => {
  try {
    dispatch(setDjLoading(true))

    const response = await axios.get('api/content/dj-characters')

    dispatch(setDjs(response.data))
  } catch (error) {
    dispatch(setDjError(error.message))
  } finally {
    dispatch(setDjLoading(false))
  }
}

export default djsSlice.reducer
