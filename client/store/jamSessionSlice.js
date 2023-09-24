import { createSlice } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'

const initialState = {
  id: null,
  tracks: [],
}

const jamSessionSlice = createSlice({
  name: 'jamSession',
  initialState,
  reducers: {
    setJamSessionId: (state, action) => {
      state.id = action.payload ? action.payload : nanoid()
    },
  },
})

export const { setJamSessionId } = jamSessionSlice.actions

export default jamSessionSlice.reducer
