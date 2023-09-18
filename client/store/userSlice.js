import { createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
  code: null,
  details: null,
  profile: null,
  showProfile: false,
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
    setProfile: (state, action) => {
      state.profile = action.payload
    },
    clearProfile: (state) => {
      state.profile = null
    },
    showProfile: (state, action) => {
      state.showProfile = true
    },
    hideProfile: (state, action) => {
      state.showProfile = false
    },
  },
})

export const {
  setUser,
  clearUser,
  setCode,
  setProfile,
  clearProfile,
  showProfile,
  hideProfile,
} = userSlice.actions

export const fetchProfile = () => async (dispatch) => {
  try {
    const { data } = await axios.get("api/profile")
    dispatch(setProfile(data))
  } catch (err) {
    console.log(err)
  }
}

export const updateProfile = (profile) => async (dispatch) => {
  try {
    const { data } = await axios.put("api/profile", profile)
    dispatch(setProfile(data))
    dispatch(hideProfile())
  } catch (err) {
    console.log(err)
  }
}

export default userSlice.reducer
