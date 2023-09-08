import { configureStore } from "@reduxjs/toolkit"
import { createLogger } from "redux-logger"
import playlistReducer from "./playlistSlice"
import playerUriListReducer from "./playerUriListSlice"
import jamSessionReducer from "./jamSessionSlice"
import userReducer from "./userSlice"
import thunkMiddleware from "redux-thunk"

const loggerMiddleware = createLogger({
  collapsed: true,
})

const store = configureStore({
  reducer: {
    playlist: playlistReducer,
    user: userReducer,
    playerUriList: playerUriListReducer,
    jamSession: jamSessionReducer,
  },
  middleware: [loggerMiddleware, thunkMiddleware],
})

export default store
