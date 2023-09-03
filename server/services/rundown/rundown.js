const { createContent } = require("../createContent")
const currentWeather = require("../currentWeather")
// const createTalk = require("../createTalk");
// const createNews = require("../createNews");



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
]

let currentContent = (function () {
  let currentIndex = 0 // start with the first item in the rundown

  return {
    next: async function (showWithSongs) {
      if (currentIndex < showWithSongs.rundown.length) {
        let content = await getContent(showWithSongs, currentIndex)
        currentIndex++ // Move to the next index
        return content
      } else {
        console.log("End of rundown reached.")
      }
    },
    reset: function () {
      currentIndex = 0 // reset index to start
    },
  }
})()

function addPlaylistToRundown(playlist) {
  let songIndex = 0

  let show = {
    radioStation: "1-2-3 FM",
    showName: "Rock Retrospectives with DJ Spike",
    date: "2023-09-01",
    timeSlot: "7:00 AM - 8:00 AM",
    rundown: [
      { type: "intro" },
      { type: "weather" },
      { type: "song", songName: null, bandName: null, duration: null },
      { type: "song", songName: null, bandName: null, duration: null },
      { type: "news" },
      { type: "talk_show" },
      { type: "song", songName: null, bandName: null, duration: null },
      { type: "song", songName: null, bandName: null, duration: null },
      { type: "outro" },
    ],
  };

  show.rundown.forEach((element) => {
    if (element.type === "song" && songIndex < playlist.length) {
      element.songName = playlist[songIndex].title
      element.bandName = playlist[songIndex].artist
      element.albumName = playlist[songIndex].album
      element.duration = playlist[songIndex].duration
      songIndex++ // Move to the next song in the playlist
    }
  })
  return show
}

async function getContent(showWithSongs, index) {
  const element = showWithSongs.rundown[index]
  if (!element) return

  if (element.type === "weather") {
    return await currentWeather()
  } else if (element.type === "song") {
    return await createContent(
      showWithSongs.radioStation,
      showWithSongs.showName,
      element.songName,
      element.bandName,
      showWithSongs.date
    )
  } else if (element.type === "talk_show") {
    // this.content = createTalk();
  } else if (element.type === "news") {
    // this.content = createNews();
  } else {
    console.warn(`Invalid content type: ${element.type}`)
  }
}

// console.log(createShow(show, playlist));

module.exports = {
  currentContent,
  addPlaylistToRundown,
}
