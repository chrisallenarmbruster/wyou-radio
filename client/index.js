import React from "react"
import { createRoot } from "react-dom/client"
import App from "./Components/App"
import { Provider } from "react-redux"
import store from "./store"
import { HashRouter } from "react-router-dom"

const root = createRoot(document.querySelector("#root"))

root.render(
  <Provider store={store}>
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </HashRouter>
  </Provider>
)
