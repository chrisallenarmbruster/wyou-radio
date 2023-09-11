const { createContent } = require("../createContent");
const currentWeather = require("../currentWeather");
const fs = require("fs");
const Tracks = require("../../db/Tracks");
const { convertMP3FileToDataURI } = require("../utl/convertMP3FileToDataURI");

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

async function getCurrentRundownIndex(userEmail) {
  console.log(userEmail);
  const userTracks = await Tracks.findOne({ where: { userEmail: userEmail } });
  return userTracks ? userTracks.currentRundownIndex : 0;
}

async function updateCurrentRundownIndex(userEmail, index) {
  await Tracks.update(
    { currentRundownIndex: index },
    { where: { userEmail: userEmail } }
  );
}

function createDefaultShow() {
  return {
    radioStation: "WYOU",
    showName: "Rock Retrospectives with DJ Spike",
    date: "2023-09-01",
    timeSlot: "7:00 AM - 8:00 AM",
    rundown: [
      // {
      //   type: "song",
      //   songName: null,
      //   bandName: null,
      //   albumName: null,
      //   duration: null,
      // },
      // {
      //   type: "song",
      //   songName: null,
      //   bandName: null,
      //   albumName: null,
      //   duration: null,
      // },
      // {
      //   type: "song",
      //   songName: null,
      //   bandName: null,
      //   albumName: null,
      //   duration: null,
      // },
      // { type: "weather" },
      // {
      //   type: "song",
      //   songName: null,
      //   bandName: null,
      //   albumName: null,
      //   duration: null,
      // },
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
        type: "end",
        songName: null,
        bandName: null,
        albumName: null,
        duration: null,
      },
    ],
  };
}

async function reset(userEmail) {
  await updateCurrentRundownIndex(userEmail, 0);
}

let currentRundownIndex = 0;

async function addPlaylistToRundown(userEmail) {
  userEmail = userEmail;
  currentRundownIndex = await getCurrentRundownIndex(userEmail);
  if (currentRundownIndex === undefined) {
    await updateCurrentRundownIndex(userEmail, 0);
  }
  const userTracks = await Tracks.findOne({ where: { userEmail } });

  if (!userTracks) {
    console.error(`Tracks for user ${userEmail} not found.`);
    return null; // Or handle this situation differently as needed
  }

  const curTrack = userTracks.curTrack;
  const nextTrack = userTracks.nextTrack;

  let show = createDefaultShow();
  if (currentRundownIndex >= show.rundown.length) {
    await reset(userEmail);
  }
  let songsPopulated = 0;

  for (let i = currentRundownIndex; i < show.rundown.length; i++) {
    if (show.rundown[i].type === "song" && songsPopulated === 0) {
      show.rundown[i].songName = curTrack.name;
      show.rundown[i].bandName = curTrack.artist;
      songsPopulated++;
    } else if (show.rundown[i].type === "song" && songsPopulated === 1) {
      show.rundown[i].songName = nextTrack.name;
      show.rundown[i].bandName = nextTrack.artist;
      songsPopulated++;
    }

    if (songsPopulated === 2) {
      break; // Both songs have been populated
    }
  }

  let content = await getContent(show, userEmail);
  return content;
}

async function getContent(showWithSongs, userEmail) {
  currentRundownIndex = await getCurrentRundownIndex(userEmail);

  if (showWithSongs.rundown[currentRundownIndex + 1].type === "end") {
    await updateCurrentRundownIndex(userEmail, 0);
    return await addPlaylistToRundown(userEmail); // Call the addPlaylistToRundown function here
  } else if (showWithSongs.rundown[currentRundownIndex + 1].type === "song") {
    let uri = await song(showWithSongs.rundown[currentRundownIndex + 1]);
    return uri;
  } else if (
    showWithSongs.rundown[currentRundownIndex + 1].type === "weather"
  ) {
    return await weatherSong(showWithSongs.rundown[currentRundownIndex + 2]);
  }

  async function weatherSong(songAfterWeather) {
    await updateCurrentRundownIndex(userEmail, currentRundownIndex + 2);
    let weatherReport = await currentWeather();
    let fileName = await createContent(
      null,
      null,
      null,
      null,
      null,
      null,
      `Summarize this weather, be brief. Weather: ${weatherReport}. End the weather report by announcing this song by ${songAfterWeather.bandName} called ${songAfterWeather.songName}. Be very brief.`
    );
    let audioURI = await convertMP3FileToDataURI(fileName);
    return audioURI;
  }

  async function song(nextElement) {
    await updateCurrentRundownIndex(userEmail, currentRundownIndex + 1);
    let fileName = await createContent(
      showWithSongs.radioStation,
      showWithSongs.showName,
      nextElement.songName,
      nextElement.bandName,
      showWithSongs.date,
      showWithSongs.timeSlot
    );
    let audioURI = await convertMP3FileToDataURI(fileName);
    return audioURI;
  }
}

module.exports = {
  reset,
  addPlaylistToRundown,
};
