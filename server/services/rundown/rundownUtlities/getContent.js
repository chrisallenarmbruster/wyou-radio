const { createContent } = require("../../createContent");
const currentWeather = require("../../currentWeather");
const { convertFileToDataURI } = require("../../utl/convertMP3FileToDataURI");
const {
  getCurrentRundownIndex,
  updateCurrentRundownIndex,
} = require("./rundownIndex");

async function weatherSong(songAfterWeather) {
  await updateCurrentRundownIndex(userEmail, currentRundownIndex + 2);

  let weatherReport = await currentWeather();

  let content = await createContent(
    null,
    null,
    null,
    null,
    null,
    null,
    profile,
    djId,
    `Summarize this weather, be brief. Weather: ${weatherReport}. End the weather report by announcing this song by ${songAfterWeather.bandName} called ${songAfterWeather.songName}. Be very brief.`
  );

  let audioURI = await convertFileToDataURI(content.fileName, "mp3");
  return { audioURI, transcript: content.text };
}

async function song(nextElement) {
  await updateCurrentRundownIndex(userEmail, currentRundownIndex + 1);
  let content = await createContent(
    showWithSongs.radioStation,
    showWithSongs.showName,
    nextElement.songName,
    nextElement.bandName,
    showWithSongs.date,
    showWithSongs.timeSlot,
    profile,
    djId
  );
  let audioURI = await convertFileToDataURI(content.fileName, "mp3");
  return { audioURI, transcript: content.text };
}

async function getContent(showWithSongs, userEmail, profile, djId) {
  const currentRundownIndex = await getCurrentRundownIndex(userEmail);

  // if (showWithSongs.rundown[currentRundownIndex + 1].type === "end") {
  //   await updateCurrentRundownIndex(userEmail, 0);
  //   return await addPlaylistToRundown(userEmail); // Call the addPlaylistToRundown function here
  // } else 
  
  if (showWithSongs.rundown[currentRundownIndex + 1].type === "song") {
    let uri = await song(showWithSongs.rundown[currentRundownIndex + 1]);
    return uri;
  } else if (
    showWithSongs.rundown[currentRundownIndex + 1].type === "weather"
  ) {
    
    return await weatherSong(showWithSongs.rundown[currentRundownIndex + 2]);
  }
}

module.exports = { getContent };
