const {
  addPlaylistToRundown,
} = require('./rundownUtlities/addPlaylistToRundown')
const {
  getCurrentRundownIndex,
  updateCurrentRundownIndex,
} = require('./rundownUtlities/rundownIndex')
const { saveToDb, reset } = require('../rundown/rundownUtlities/dbUtilities')
const currentWeather = require('../currentWeather')
const historySegment = require('../historySegment')
const { convertFileToDataURI } = require('../utl/convertMP3FileToDataURI')
const { createContent } = require('../createContent')

async function showRunner(userEmail, jamSessionId, user, djId, station, chain) {
  const { lat, long } = user.profile
  const { display_name } = user
  let content = {}
  let { show, nextTrackURI, tempSongName, tempBandName } =
    await addPlaylistToRundown(userEmail, jamSessionId)
  const currentRundownIndex = await getCurrentRundownIndex(userEmail)

  if (show.rundown[currentRundownIndex + 1].type === 'song') {
    let nextElement = show.rundown[currentRundownIndex + 1]

    await updateCurrentRundownIndex(userEmail, currentRundownIndex + 1)

    content = await createContent(
      show.radioStation,
      show.showName,
      nextElement.songName,
      nextElement.bandName,
      show.date,
      show.timeSlot,
      user,
      djId,
      station,
      chain
    )

    let audioURI = await convertFileToDataURI(content.fileName, 'mp3')

    //  saves the next track dj auido and transcript to the database
    await saveToDb(
      jamSessionId,
      currentRundownIndex + 1,
      nextTrackURI,
      tempSongName,
      tempBandName,
      audioURI,
      content.text
    )

    return audioURI
  } else if (show.rundown[currentRundownIndex + 1].type === 'weather') {
    let songAfterWeather = show.rundown[currentRundownIndex + 2]

    await updateCurrentRundownIndex(userEmail, currentRundownIndex + 2)

    let weatherReport = await currentWeather(lat, long)
    content = await createContent(
      null,
      null,
      null,
      null,
      null,
      null,
      user,
      djId,
      station,
      chain,
      `Summarize this weather, be brief. Weather: ${weatherReport}. End the weather report by announcing this song by ${songAfterWeather.bandName} called ${songAfterWeather.songName}. Be very brief.`,
      null
    )

    let audioURI = await convertFileToDataURI(content.fileName, 'mp3')

    await saveToDb(
      jamSessionId,
      currentRundownIndex + 2,
      nextTrackURI,
      tempSongName,
      tempBandName,
      audioURI,
      content.text
    )

    return audioURI
  } else if (show.rundown[currentRundownIndex + 1].type === 'history') {
    let songAfterHistory = show.rundown[currentRundownIndex + 2]

    await updateCurrentRundownIndex(userEmail, currentRundownIndex + 2)

    let history = await historySegment(
      display_name,
      songAfterHistory.songName,
      songAfterHistory.bandName
    )

    content = await createContent(
      null,
      null,
      null,
      null,
      null,
      null,
      display_name,
      djId,
      station,
      chain,
      null,
      history
    )

    let audioURI = await convertFileToDataURI(content.fileName, 'mp3')

    await saveToDb(
      jamSessionId,
      currentRundownIndex + 2,
      nextTrackURI,
      tempSongName,
      tempBandName,
      audioURI,
      content.text
    )

    return audioURI
  }
}

module.exports = { showRunner }
