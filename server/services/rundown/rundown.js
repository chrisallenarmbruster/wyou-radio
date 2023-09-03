const { get } = require("http");
const { createContent } = require("../createContent");
const currentWeather = require("../currentWeather");
// const createTalk = require("../createTalk");
// const createNews = require("../createNews");

// Playlist?
// {
//   songName,
//   bandName,
//   duration
//}
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
];

function createShow(show, playlist) {
  function addPlaylistToRundown(show) {
    show.rundown.forEach((element) => {
      if (element.type === "song") {
        element.songName = playlist[0].songName;
        element.bandName = playlist[0].bandName;
        element.duration = playlist[0].duration;
      }
    });
    return show;
  }

  function getContent(showWithSongs) {
    showWithSongs.rundown.forEach(async (element) => {
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
    });
    return showWithSongs;
  }

  let showWithSongs = addPlaylistToRundown(show);
  let showWithContent = getContent(showWithSongs);
  return showWithContent;
}

console.log(createShow(show, playlist));

module.exports = { createShow };
