const { get } = require("http");
const { createContent } = require("../createContent");
const currentWeather = require("../currentWeather");
// const createTalk = require("../createTalk");
// const createNews = require("../createNews");

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

let playlist = [
  { songName: "Sweet Child O Mine", bandName: "Guns N Roses", duration: 356 },
  {
    songName: "Welcome to the Jungle",
    bandName: "Guns N Roses",
    duration: 275,
  },
  { songName: "Paradise City", bandName: "Guns N Roses", duration: 408 },
  { songName: "Patience", bandName: "Guns N Roses", duration: 409 },
  { songName: "November Rain", bandName: "Guns N Roses", duration: 537 },
  { songName: "Don't Cry", bandName: "Guns N Roses", duration: 284 },
];

let currentContent = (function () {
  let currentIndex = 0; // start with the first item in the rundown

  return {
    next: async function (showWithSongs) {
      if (currentIndex < showWithSongs.rundown.length) {
        let content = await getContent(showWithSongs, currentIndex);
        currentIndex++; // Move to the next index
        return content;
      } else {
        console.log("End of rundown reached.");
      }
    },
    reset: function () {
      currentIndex = 0; // reset index to start
    },
  };
})();

function addPlaylistToRundown(show, playlist) {
  let songIndex = 0;

  show.rundown.forEach((element) => {
    if (element.type === "song" && songIndex < playlist.length) {
      element.songName = playlist[songIndex].songName;
      element.bandName = playlist[songIndex].bandName;
      element.duration = playlist[songIndex].duration;
      songIndex++; // Move to the next song in the playlist
    }
  });
  return show;
}

async function getContent(showWithSongs, index) {
  const element = showWithSongs.rundown[index];
  if (!element) return;

  if (element.type === "weather") {
    return await currentWeather();
  } else if (element.type === "song") {
    return await createContent(
      showWithSongs.radioStation,
      showWithSongs.showName,
      element.songName,
      element.bandName,
      showWithSongs.date
    );
  } else if (element.type === "talk_show") {
    // this.content = createTalk();
  } else if (element.type === "news") {
    // this.content = createNews();
  } else {
    console.warn(`Invalid content type: ${element.type}`);
  }
}

console.log(createShow(show, playlist));

module.exports = {
  currentContent,
  addPlaylistToRundown,
};
