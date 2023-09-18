import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setUser } from "../store/userSlice"
import { fetchProfile } from "../store/userSlice"
import { setJamSessionId } from "../store/jamSessionSlice"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState()
  const [refreshToken, setRefreshToken] = useState()
  const [expiresIn, setExpiresIn] = useState()
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSpotifyAuthData = async () => {
      try {
        const response = await axios.post("/api/spotify/login", {
          code,
        })

        dispatch(setUser(response.data))
        dispatch(fetchProfile())
        dispatch(setJamSessionId())
        setAccessToken(response.data.accessToken)
        setRefreshToken(response.data.refreshToken)
        setExpiresIn(response.data.expiresIn)

        window.history.pushState({}, null, "/")
        // navigate("/home")
      } catch (error) {
        window.location = "/"
      }
    }

    if (code) {
      fetchSpotifyAuthData()
    }
  }, [!!(code || user?.details?.accessToken)])

  useEffect(() => {
    const refreshSpotifyToken = async () => {
      if (!refreshToken || !expiresIn) return

      const interval = setInterval(async () => {
        try {
          const response = await axios.post("/api/spotify/refresh", {
            refreshToken,
          })

          dispatch(setUser(response.data))
          setAccessToken(response.data.accessToken)
          setExpiresIn(response.data.expiresIn)
        } catch (error) {
          window.location = "/"
        }
      }, (expiresIn - 60) * 1000)

      return () => clearInterval(interval)
    }

    refreshSpotifyToken()
  }, [refreshToken, expiresIn])

  return accessToken
}
