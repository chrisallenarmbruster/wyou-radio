import { configureStore } from "@reduxjs/toolkit"
import { createLogger } from "redux-logger"
import tunerReducer from "./tunerSlice"
import jamSessionReducer from "./jamSessionSlice"
import playerReducer from "./playerSlice"
import userReducer from "./userSlice"
import thunkMiddleware from "redux-thunk"

const loggerMiddleware = createLogger({
  collapsed: true,
})

const store = configureStore({
  reducer: {
    user: userReducer,
    jamSession: jamSessionReducer,
    tuner: tunerReducer,
    player: playerReducer,
  },
  middleware: [loggerMiddleware, thunkMiddleware],
})

export default store
