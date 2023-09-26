const { fetchSpeech } = require("./audioService");

const { saveDebugTrackerToFile } = require("./utl/debugTracker");
const { songPrompts } = require("./utl/promptConstructor");
const { djCharacters } = require("./djCharacters");

async function createContent(
  radioStation,
  showName,
  songName,
  bandName,
  date,
  timeSlot,
  user,
  djId,
  station,
  chain,
  weather,
  history
) {
  try {
    const { details } = await djCharacters(djId);
    const { voiceID } = details;

    const debugTracker = [];

    //TODO: Need to set this up to create Weather, News, etc. Also need to construct chat history.

    let result;
    if (weather) {
      result = await chain.call({
        input: weather,
      });
    } else if (history) {
      result = await chain.call({
        input: history,
      });
    } else {
      let input = await songPrompts(
        radioStation,
        showName,
        songName,
        bandName,
        date,
        timeSlot,
        user,
        djId,
        station
      );
      result = await chain.call({
        input: input,
      });
    }

    saveDebugTrackerToFile(debugTracker);
    const timestamp = Date.now();
    //TODO: maybe clean up the response taking out special characters before sending to the API
    const response = await fetchSpeech(
      voiceID,
      result.response,
      `${songName}_${bandName}_${timestamp}`
    );
    if (response === "error") {
      console.log(response);
      return;
    } else return response;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { createContent };
