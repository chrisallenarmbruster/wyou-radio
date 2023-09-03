import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  details: null,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.details = action.payload
    },
    clearUser: (state) => {
      state.details = null
    },
  },
})

export const { setUser, clearUser } = userSlice.actions

export default userSlice.reducer
