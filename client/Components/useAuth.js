import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { setUser } from "../store/userSlice"
import axios from "axios"

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState()
  const [refreshToken, setRefreshToken] = useState()
  const [expiresIn, setExpiresIn] = useState()
  const dispatch = useDispatch()

  useEffect(() => {
    axios
      .post("http://localhost:3000/api/spotify/login", {
        code,
      })
      .then((res) => {
        dispatch(setUser(res.data))
        setAccessToken(res.data.accessToken)
        setRefreshToken(res.data.refreshToken)
        setExpiresIn(res.data.expiresIn)
        window.history.pushState({}, null, "/")
      })
      .catch(() => {
        window.location = "/"
      })
  }, [code])

  useEffect(() => {
    if (!refreshToken || !expiresIn) return
    const interval = setInterval(() => {
      axios
        .post("http://localhost:3000/api/spotify/refresh", {
          refreshToken,
        })
        .then((res) => {
          dispatch(setUser(res.data))
          setAccessToken(res.data.accessToken)
          setExpiresIn(res.data.expiresIn)
        })
        .catch(() => {
          window.location = "/"
        })
    }, (expiresIn - 60) * 1000)

    return () => clearInterval(interval)
  }, [refreshToken, expiresIn])

  return accessToken
}
