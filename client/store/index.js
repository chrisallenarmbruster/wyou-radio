import { configureStore } from "@reduxjs/toolkit"
import { createLogger } from "redux-logger"
import playlistReducer from "./playlistSlice"
import userReducer from "./userSlice"
import thunkMiddleware from "redux-thunk"

const loggerMiddleware = createLogger({
  collapsed: true,
})

const store = configureStore({
  reducer: {
    playlist: playlistReducer,
    user: userReducer,
  },
  middleware: [loggerMiddleware, thunkMiddleware],
})

export default store
