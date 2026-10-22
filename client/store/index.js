import { configureStore } from "@reduxjs/toolkit"
import jamSessionReducer from "./jamSessionSlice"
import playerReducer from "./playerSlice"
import userReducer from "./userSlice"
import stationsReducer from "./stationsSlice"
import djsReducer from "./djsSlice"
import thunkMiddleware from "redux-thunk"

const store = configureStore({
  reducer: {
    user: userReducer,
    jamSession: jamSessionReducer,
    player: playerReducer,
    stations: stationsReducer,
    djs: djsReducer,
  },
  middleware: [thunkMiddleware],
})

export default store
