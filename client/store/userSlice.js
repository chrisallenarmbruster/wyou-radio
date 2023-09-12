import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  code: null,
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
    setCode: (state, action) => {
      state.code = action.payload
    },
  },
})

export const { setUser, clearUser, setCode } = userSlice.actions

export default userSlice.reducer
