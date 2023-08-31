import React from "react"
import { createRoot } from "react-dom/client"
import App from "./js/Components/App"
// import { Provider } from "react-redux"
// import store from "./js/store"
import { HashRouter } from "react-router-dom"
import "./scss/style.scss"
// import "bootstrap/scss/bootstrap.scss"

const root = createRoot(document.querySelector("#root"))

root.render(
  // <Provider store={store}>
  <HashRouter>
    <App />
  </HashRouter>
  // </Provider>
)
