import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  tracks: [],
  queue: [],
  loading: false,
  error: null,
};

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    addTrack: (state, action) => {
      state.tracks.push(action.payload);
      // exportPlaylist(state.tracks);
    },
    addTracks: (state, action) => {
      state.tracks = [...state.tracks, ...action.payload];
      // exportPlaylist(state.tracks);
    },
    removeTrack: (state, action) => {
      state.tracks = state.tracks.filter(
        (track) => track.id !== action.payload.id
      );
      // exportPlaylist(state.tracks);
    },
    clearPlaylist: (state) => {
      state.tracks = [];
    },
    setPlaylistLoading: (state, action) => {
      state.loading = action.payload;
      exportPlaylist(state.tracks);
    },
    setPlaylistError: (state, action) => {
      state.error = action.payload;
    },
    setQueue: (state, action) => {
      console.log("setQueue", action.payload)
      state.queue = [...action.payload]
    },
  },
});

export const {
  addTrack,
  addTracks,
  removeTrack,
  clearPlaylist,
  setPlaylistLoading,
  setPlaylistError,
  setQueue,
} = playlistSlice.actions

export const fetchPlaylistTracks =
  (playlistId, accessToken) => async (dispatch) => {
    try {
      dispatch(setPlaylistLoading(true));

      const response = await axios.get(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      const tracks = response.data.items.map((item) => ({
        title: item.track.name,
        artist: item.track.artists[0].name,
        album: item.track.album.name,
        duration: item.track.duration_ms,
        uri: item.track.uri,
        id: item.track.id,
      }))
      console.log("tracks", tracks)
      dispatch(addTracks(tracks))
      dispatch(setPlaylistError(null))
      dispatch(setPlaylistLoading(false))
    } catch (error) {
      console.log(error);
      dispatch(setPlaylistError(error.message));
      dispatch(setPlaylistLoading(false));
    }
  };

export const exportPlaylist = async (playlist) => {
  try {
    const response = await axios.post("api/content/add-playlist", {
      playlist: playlist,
    });
    console.log(response.data);
    debugger;
  } catch (error) {
    console.log(error);
  }
};

export const nextDJTrack = async (index) => {
  try {
    const response = await axios.get(`api/content/next-content?index=${index}`);
    console.log(response.data);
    debugger;
  } catch (error) {
    console.log(error);
  }
};

export const fetchQueueTracks = () => async (dispatch, getState) => {
  try {
    const accessToken = getState().user.details.accessToken
    const response = await axios.get(
      `https://api.spotify.com/v1/me/player/queue`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    const queue = response.data.queue.map((item) => {
      return {
        title: item.name,
        artist: item.artists[0].name,
        album: item.album.name,
        duration: item.duration_ms,
        uri: item.uri,
        id: item.id,
      }
    })
    console.log("queue", queue)
    dispatch(setQueue(queue))
  } catch (error) {
    console.log("Redux Error!", error)
  }
}

export default playlistSlice.reducer
