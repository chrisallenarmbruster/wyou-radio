import { configureStore } from "@reduxjs/toolkit"
import { createLogger } from "redux-logger"
import playlistReducer from "./playlistSlice"
import thunkMiddleware from "redux-thunk"

const loggerMiddleware = createLogger({
  collapsed: true,
})

const store = configureStore({
  reducer: {
    playlist: playlistReducer,
  },
  middleware: [loggerMiddleware, thunkMiddleware],
})

export default store
