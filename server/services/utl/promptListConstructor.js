const { djCharacters } = require("../djCharacters");
const { getRandomElement } = require("./randomElement");
//TODO: Make another list that is dynamic basic on a websearch for todays headllines

async function constructPromptListWithCounts(details) {
  let djId = details.djId;
  let djProfile = await djCharacters(djId);
  let djName = djProfile.djName;
  let djStyle = djProfile.details.djStyle;
  let context = djProfile.details.context;
  let djCoreInstructions = `Create a script with no titles, headings, annotations, or reference to the speaker followed by a colon. Keep in mind what you have said previously. Be creative and do not repeat yourself. The script should reflects verbatim what a disk jockey would say to tee up the ${details.songName} by ${details.bandName} . Do not refer to yourself in the third person. Do not introduce yourself more than once during the show.`;
  let djChannel = `The Station is called ${details.radioStation}. The showName is ${details.showName}. The date is ${details.date}.  The timeSlot is ${details.timeSlot}.`;
  let brevity = [
    "Be very brief. Keep you response to two sentences or less.",
    "keep your response to two to four sentences.",
    "keep your response to four to six sentences.",
  ];
  let personalization = [
    `Refer to ${details.name} as though they are your only listener.`,
  ];

  const djTopics = [
    "Reference something you said earlier in the conversation as a joke.",
    "Be very brief.",
    "Tell a personal story about the band or the song.",
    "Mention a personal story about yourself.",
    "Mention a personal story about the station.",
    "Mention a story about the news.",
    "Mention a story about the weather.",
    "Mention a story about the traffic.",
    "Mention a story about the sports.",
    "Mention a story about the local community.",
    "Tell a joke.",
    "Make a pun.",
    "Make a reference to a movie.",
    "Make a reference to a TV show.",
    "Make a reference to a book.",
    "Make a reference to a video game.",
    "Make a reference to a comic book.",
    "Make a reference to a podcast.",
    "Share an interesting fact or trivia.",
    "Play a snippet of an interview with an artist or celebrity.",
    "Highlight a listener's comment or dedication.",
    "Give a shoutout to a local business or event.",
    "Talk about a concert or music event happening nearby.",
    "Discuss a trending topic or viral moment.",
    "Make a reference to a popular meme or social media trend.",
    "Share an inspirational quote or story.",
    "Mention an upcoming station contest or giveaway.",
    "Highlight an album anniversary or an artist's birthday.",
    "Discuss a recent concert or event you attended.",
    "Recommend a new artist or song to listen to.",
    "Share the results of a station poll or listener survey.",
    "Talk about a local charity or initiative worth supporting.",
    "Make a reference to a historic event or anniversary.",
    "Discuss a current pop culture controversy or debate.",
    "Share behind-the-scenes tidbits about radio show production.",
    "Talk about a memorable fan interaction or call-in moment.",
    "Share a music trivia about a classic album.",
    "Drop a fun fact about a famous musician's early career.",
    "Discuss a lesser-known record-breaking music achievement.",
    "Share a sports trivia about a famous match or game from the past.",
    "Mention a surprising fact about an athlete's training regimen.",
    "Talk about a sport that's popular in another part of the world.",
    "Highlight an unusual or quirky sport that few know about.",
    "Reveal a movie trivia related to a famous scene or character.",
    "Share a fascinating fact about the history of a particular sport.",
    "Discuss a popular song's origin or the real story behind its lyrics.",
    "Mention an iconic sports moment and the backstory few people know.",
    "Share a piece of trivia about a popular sports venue or stadium.",
    "Discuss a famous artist or band that had a significant sports connection.",
    "Reveal trivia about a renowned sports event's beginnings or traditions.",
    "Talk about a unique musical instrument and its history.",
    "Mention a trivia about a traditional sport from another culture.",
  ];

  return {
    type1: {
      prompt: `${djStyle} ${djCoreInstructions} ${djChannel} ${getRandomElement(
        djTopics
      )}`,
      frequency: 0,
    },
    type2: {
      prompt: `${djStyle} ${djCoreInstructions} ${getRandomElement(
        djTopics
      )} CONTEXT: Name: ${djName} Background: ${context}`,
      frequency: 0,
    },
    type3: {
      prompt: `${djStyle} ${djCoreInstructions} ${getRandomElement(
        personalization
      )} ${brevity[0]}`,
      frequency: 1,
    },
  };
}

module.exports = { constructPromptListWithCounts };
