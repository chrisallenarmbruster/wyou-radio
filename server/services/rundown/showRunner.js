const {
  addPlaylistToRundown,
} = require("./rundownUtlities/addPlaylistToRundown");
const {
  getCurrentRundownIndex,
  updateCurrentRundownIndex,
} = require("./rundownUtlities/rundownIndex");
const { saveToDb, reset } = require("../rundown/rundownUtlities/dbUtilities");
const currentWeather = require("../currentWeather");
const { convertFileToDataURI } = require("../utl/convertMP3FileToDataURI");
const { createContent } = require("../createContent");

async function showRunner(userEmail, jamSessionId, display_name, djId) {
  let content = {};
  let { show, nextTrackURI, tempSongName, tempBandName } =
    await addPlaylistToRundown(userEmail, jamSessionId);
  const currentRundownIndex = await getCurrentRundownIndex(userEmail);

  if (show.rundown[currentRundownIndex + 1].type === "song") {
    let nextElement = show.rundown[currentRundownIndex + 1];

    await updateCurrentRundownIndex(userEmail, currentRundownIndex + 1);

    content = await createContent(
      show.radioStation,
      show.showName,
      nextElement.songName,
      nextElement.bandName,
      show.date,
      show.timeSlot,
      display_name,
      djId
    );

    let audioURI = await convertFileToDataURI(content.fileName, "mp3");

    //  saves the next track dj auido and transcript to the database
    await saveToDb(
      jamSessionId,
      currentRundownIndex + 1,
      nextTrackURI,
      tempSongName,
      tempBandName,
      content.audioURI,
      content.transcript
    );

    return audioURI;
  } else if (show.rundown[currentRundownIndex + 1].type === "weather") {
    let songAfterWeather = show.rundown[currentRundownIndex + 2];

    await updateCurrentRundownIndex(userEmail, currentRundownIndex + 2);

    let weatherReport = await currentWeather();
    content = await createContent(
      null,
      null,
      null,
      null,
      null,
      null,
      display_name,
      djId,
      `Summarize this weather, be brief. Weather: ${weatherReport}. End the weather report by announcing this song by ${songAfterWeather.bandName} called ${songAfterWeather.songName}. Be very brief.`
    );

    let audioURI = await convertFileToDataURI(content.fileName, "mp3");

    await saveToDb(
      jamSessionId,
      currentRundownIndex + 2,
      nextTrackURI,
      tempSongName,
      tempBandName,
      content.audioURI,
      content.transcript
    );

    return audioURI;
  }
}

module.exports = { showRunner };
