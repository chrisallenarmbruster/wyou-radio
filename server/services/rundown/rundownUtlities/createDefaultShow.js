function createDefaultShow() {
  return {
    radioStation: "WYOU",
    showName: "Default Show",
    date: "2023-09-01",
    rundown: [
      {
        type: "song",
        songName: null,
        bandName: null,
        albumName: null,
        duration: null,
      },
      {
        type: "song",
        songName: null,
        bandName: null,
        albumName: null,
        duration: null,
      },
      {
        type: "song",
        songName: null,
        bandName: null,
        albumName: null,
        duration: null,
      },
      { type: "weather" },
      {
        type: "song",
        songName: null,
        bandName: null,
        albumName: null,
        duration: null,
      },
      {
        type: "song",
        songName: null,
        bandName: null,
        albumName: null,
        duration: null,
      },
      { type: "history" },
      {
        type: "song",
        songName: null,
        bandName: null,
        albumName: null,
        duration: null,
      },
      {
        type: "end",
        songName: null,
        bandName: null,
        albumName: null,
        duration: null,
      },
    ],
  };
}

module.exports = { createDefaultShow };
