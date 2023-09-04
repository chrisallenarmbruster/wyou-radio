import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  tracks: [],
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
  },
});

export const {
  addTrack,
  addTracks,
  removeTrack,
  clearPlaylist,
  setPlaylistLoading,
  setPlaylistError,
} = playlistSlice.actions;

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
      );
      console.log("response: ", response);
      const tracks = response.data.items.map((item) => ({
        title: item.track.name,
        artist: item.track.artists[0].name,
        album: item.track.album.name,
        duration: item.track.duration_ms,
        uri: item.track.uri,
        id: item.track.id,
      }));

      dispatch(addTracks(tracks));
      dispatch(setPlaylistError(null));
      dispatch(setPlaylistLoading(false));
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

export default playlistSlice.reducer;
