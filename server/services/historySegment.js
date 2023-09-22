async function historySegment(
  name,
  nextTrackTitle,
  nextTrackArtist,
  genre = null
) {
  Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
  };

  const today = new Date();

  const intro = [
    "Musical Milestones",
    "This Day in Music History",
    "Today in Music History",
    "Another Great Day in Music's Past",
    "Today in Music's Memory Lane",
    "Time Capsule Tune-in",
    "Sonic Time Capsule",
    "Date with Music Destiny",
    "Music Calendar",
    "Harmonious History Lesson",
  ];

  const outro = [
    "That's all for now. Stay tuned for other important moments in music history.",
    "This is just one important moment in music history.  Keep listening for more.",
    "Stay curious about music history.  There's always more to come.",
    "Stay curious, stay musical and stay tuned for more.",
    "Until next time, keep listening and keep learning.",
    "I hope you enjoyed this short ride through history. Keep listening for more musical discoveries.",
    "The more you listen, the more you discover. Until next time, stay harmonious!",
    "That's all for now. Keep learning, and let the melodies guide you to new musical horizons.",
    "Until next time, spread the musical insights you've learned today.",
    "Until next time, let the music continue.",
  ];

  const genres = [
    "classical",
    "rock",
    "country",
    "pop",
    "hip-hop",
    "r&b",
    "jazz",
  ];

  const rndGenre = genre || genres.random();

  const musicHistoryPrompt = `
  What is a noteworthy event in ${rndGenre} music that happened on the date ${today.toLocaleString(
    "en-us",
    {
      month: "long",
    }
  )} ${today.getDate()}?
  Be brief and specific. 
  Do not give a generic answer.
  Address ${name} as your primary listener.
  Do not assume the listener is currently listening to ${rndGenre} music.
  Do not give an answer related to the artist or track you are about to play.
  Do not include speaker annotations, cues or special characters.
  After addressing the listener, tee up your answer with ${intro.random()}.  
  Conclude with ${outro.random()}.
  Then introduce the next track ${nextTrackTitle} by ${nextTrackArtist}.
  `;

  return musicHistoryPrompt;
}

module.exports = historySegment;
