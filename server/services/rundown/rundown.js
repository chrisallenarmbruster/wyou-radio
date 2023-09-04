const { createContent } = require("../createContent");
const currentWeather = require("../currentWeather");

let currentIndex = 0;

let playlist = [
  {
    title: "Sweet Child O Mine",
    artist: "Guns N Roses",
    album: "test",
    duration: 356,
  },
  {
    title: "Welcome to the Jungle",
    artist: "Guns N Roses",
    album: "test",
    duration: 275,
  },
  {
    title: "Paradise City",
    artist: "Guns N Roses",
    album: "test",
    duration: 408,
  },
  { title: "Patience", artist: "Guns N Roses", album: "test", duration: 409 },
  {
    title: "November Rain",
    artist: "Guns N Roses",
    album: "test",
    duration: 537,
  },
  { title: "Don't Cry", artist: "Guns N Roses", album: "test", duration: 284 },
];

let previousRundown = null;

function next(showWithSongs) {
  if (currentIndex < showWithSongs.rundown.length) {
    const content = getContent(showWithSongs);
    currentIndex++;
    return content;
  } else {
    console.log("End of rundown reached.");
  }
}

function reset() {
  currentIndex = 0;
}

function addPlaylistToRundown(newPlaylist) {
  const show = createDefaultShow();
  let songIndex = 0;

  for (let i = currentIndex; i < show.rundown.length; i++) {
    const element = show.rundown[i];
    if (element.type === "song" && songIndex < newPlaylist.length) {
      if (
        !previousRundown ||
        (previousRundown &&
          JSON.stringify(previousRundown.rundown[i]) !==
            JSON.stringify(element))
      ) {
        element.songName = newPlaylist[songIndex].title;
        element.bandName = newPlaylist[songIndex].artist;
        element.albumName = newPlaylist[songIndex].album;
        element.duration = newPlaylist[songIndex].duration;
      }
      songIndex++;
    }
  }

  previousRundown = JSON.parse(JSON.stringify(show));

  return show;
}

function createDefaultShow() {
  return {
    radioStation: "1-2-3 FM",
    showName: "Rock Retrospectives with DJ Spike",
    date: "2023-09-01",
    timeSlot: "7:00 AM - 8:00 AM",
    rundown: [
      { type: "intro" },
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
      { type: "news" },
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
      {
        type: "song",
        songName: null,
        bandName: null,
        albumName: null,
        duration: null,
      },
      { type: "outro" },
    ],
  };
}

async function getContent(showWithSongs) {
  const element = showWithSongs.rundown[currentIndex];
  if (!element) return;

  if (
    !previousRundown ||
    (previousRundown &&
      JSON.stringify(previousRundown.rundown[currentIndex]) !==
        JSON.stringify(element))
  ) {
    if (element.type === "weather") {
      return await currentWeather();
    } else if (element.type === undefined || element.type === "song") {
      return await createContent(
        showWithSongs.radioStation,
        showWithSongs.showName,
        element.songName,
        element.bandName,
        showWithSongs.date
      );
    } else if (element.type === "talk_show") {
      // this.content = createTalk();
      return null;
    } else if (element.type === "news") {
      // this.content = createNews();
      return null;
    } else {
      console.warn(`Invalid content type: ${element.type}`);
    }
  }
}

module.exports = {
  next,
  reset,
  addPlaylistToRundown,
};
