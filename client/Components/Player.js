import React from "react"
import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"

export default function Player({ accessToken, trackUri }) {
  const [play, setPlay] = useState(false)

  useEffect(() => setPlay(true), [trackUri])

  if (!accessToken) return null

  return (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      callback={(state) => {
        console.log(state)
        if (!state.isPlaying) setPlay(false)
      }}
      // play={play}
      play={true}
      // one at a time, based on clicking a search result
      // uris={trackUri ? [trackUri] : []}

      // hardcoding a list of tracks
      // uris={[
      //   "spotify:track:2SiXAy7TuUkycRVbbWDEpo",
      //   "spotify:track:6QnVsqsS9W3E7HIc28vxpL",
      //   "spotify:track:4JiEyzf0Md7KEFFGWDDdCr",
      //   "spotify:track:1gcESexgftSuLuML57Y69q",
      //   "spotify:track:1QEEqeFIZktqIpPI4jSVSF",
      //   "spotify:track:1mSClObliRtgPVT399COQH",
      //   "spotify:track:40riOy7x9W7GXjyGp4pjAv",
      //   "spotify:track:3qiyyUfYe7CRYLucrPmulD",
      //   "spotify:track:3ifaGhNHnCPQ9zdnOfolcZ",
      //   "spotify:track:6H3kDe7CGoWYBabAeVWGiD",
      //   "spotify:track:4alHo6RGd0D3OUbTPExTHN",
      //   "spotify:track:6WzIJG0KNBo4JSjYjVJLwv",
      //   "spotify:track:4KfSdst7rW39C0sfhArdrz",
      //   "spotify:track:5SAUIWdZ04OxYfJFDchC7S",
      //   "spotify:track:5QTxFnGygVM4jFQiBovmRo",
      //   "spotify:track:4DMKwE2E2iYDKY01C335Uw",
      //   "spotify:track:72ahyckBJfTigJCFCviVN7",
      //   "spotify:track:1CQqupcyMg7176PPmIVmSj",
      //   "spotify:track:3XcjIvaZVUFAIdIYZqY9bd",
      //   "spotify:track:3lN8PP6R2IxbLP05QpYXng",
      // ]}

      uris={["spotify:playlist:6WESoRu7keGwiyag0owvuV"]}
      styles={{
        activeColor: "#fff",
        bgColor: "#333",
        color: "#fff",
        loaderColor: "#fff",
        sliderColor: "#1cb954",
        trackArtistColor: "#ccc",
        trackNameColor: "#fff",
      }}
    />
  )
}
