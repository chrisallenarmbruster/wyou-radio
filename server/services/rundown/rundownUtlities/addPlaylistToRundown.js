const Tracks = require("../../../db/Tracks");
const { saveToDb, reset } = require("./dbUtilities");
const { createDefaultShow } = require("./createDefaultShow");
const {
  getCurrentRundownIndex,
  updateCurrentRundownIndex,
} = require("./rundownIndex");
const sessionFlag = require("../../utl/globalVariableModule");

async function addPlaylistToRundown(userEmail, jamSessionId) {
  let tempSongName;
  let tempBandName;
  let songsPopulated = 0;
  let currentRundownIndex = 0;
  let show = createDefaultShow();

  const { curTrack, nextTrack } = await Tracks.findOne({
    where: { userEmail },
  });
  if (!curTrack || !nextTrack) {
    console.error(`Tracks for user ${userEmail} not found.`);
    return null;
  }
  let curTrackURI = curTrack.uri;
  let nextTrackURI = nextTrack.uri;

  //check if new session and reset rundown index if so, if not get current rundown index
  if (sessionFlag.get()) {
    await updateCurrentRundownIndex(userEmail, 0);
  } else {
    currentRundownIndex = await getCurrentRundownIndex(userEmail);
  }

  //check if rundown index is undefined and set to zero if so
  if (currentRundownIndex === undefined) {
    await updateCurrentRundownIndex(userEmail, 0);
  }

  //check if rundown index is greater than or equal to rundown length and reset if so
  if (currentRundownIndex >= show.rundown.length) {
    await reset(userEmail);
  }

  //Populate rundown with song names and band names
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
      break;
    }
  }
  //retrieve song and band names from rundown
  if (show.rundown[currentRundownIndex + 1].type !== "song") {
    tempSongName = show.rundown[currentRundownIndex + 2].songName;
    tempBandName = show.rundown[currentRundownIndex + 2].bandName;
  } else {
    tempSongName = show.rundown[currentRundownIndex + 1].songName;
    tempBandName = show.rundown[currentRundownIndex + 1].bandName;
  }

  // checks session flag to determine if this is the first time through. If so, saves the first song to the database.
  if (currentRundownIndex === 0 && sessionFlag.get()) {
    await saveToDb(
      jamSessionId,
      currentRundownIndex,
      curTrackURI,
      show.rundown[currentRundownIndex].songName,
      show.rundown[currentRundownIndex].bandName
    );
  }
  sessionFlag.set(false);

  return { show, nextTrackURI, tempSongName, tempBandName };
}

module.exports = {
  addPlaylistToRundown,
};
