const JamSessionTracks = require("../../../db/JamSessionTracks");

async function saveToDb(
  jamSessionId,
  currentRundownIndex,
  uri,
  name,
  artist,
  audioDataURI,
  transcript
) {
  try {
    await JamSessionTracks.create({
      jamSessionId: jamSessionId,
      runDownIndex: currentRundownIndex,
      spotifyTrackId: uri,
      spotifyTrackName: name,
      spotifyTrackArtist: artist,
      djAudioDataURI: audioDataURI,
      djAudioTranscript: transcript,
    });
    console.log("Data saved successfully!");
  } catch (error) {
    console.error("Error saving to JamSessionTracks:", error);
  }
}

async function reset(userEmail) {
  await updateCurrentRundownIndex(userEmail, 0);
}

module.exports = { saveToDb, reset };
