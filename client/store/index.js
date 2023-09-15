import { configureStore } from "@reduxjs/toolkit"
import { createLogger } from "redux-logger"
import jamSessionReducer from "./jamSessionSlice"
import playerReducer from "./playerSlice"
import userReducer from "./userSlice"
import stationsReducer from "./stationsSlice"
import djsReducer from "./djsSlice"
import thunkMiddleware from "redux-thunk"

const loggerMiddleware = createLogger({
  collapsed: true,
})

const store = configureStore({
  reducer: {
    user: userReducer,
    jamSession: jamSessionReducer,
    player: playerReducer,
    stations: stationsReducer,
    djs: djsReducer,
  },
  middleware: [loggerMiddleware, thunkMiddleware],
})

export default store
