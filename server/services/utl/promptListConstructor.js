const { djCharacters } = require("../djCharacters");
const { getRandomElement } = require("./randomElement");
//TODO: Make another list that is dynamic basic on a websearch for todays headllines

async function constructPromptListWithCounts(details) {
  let djId = details.djId;
  let djProfile = await djCharacters(djId);
  let djName = djProfile.djName;
  let djStyle = djProfile.details.djStyle;
  let context = djProfile.details.context;

  // `The following is a transcript of everything said by you, a disk jockey. The Human is prompting you on what to say and how. Respond following the provided INSTRUCTIONS. Create you answer so they are thematically consistent with the provided CONTEXT:`;
  let brevity = [
    "Be very brief. Limit your script to 2 sentences.",
    "Limit your script to 4-6 sentences.",
    "Limit your script to 4-6 sentences.",
  ];
  let songInto = `Craft a script that reflects verbatim what a you would say to tee up the song ${details.songName} by ${details.bandName}. Respond following the provided INSTRUCTIONS. Create you answer so they are thematically consistent with the provided CONTEXT.`;

  let djCoreInstructions = `1. Avoid repetition in your dialogue.\n2. Ensure your dialogue flows naturally, building from previous statements.\n3. Do not use the descriptors provided by the user to describe yourself.\n4.Only introduce yourself once.\n5. State your name only once.\n6. Always speak in the first person.\n7. Format your response as a continuous script without speaker annotations or special characters.\n8. ${getRandomElement(
    brevity
  )}`;
  let djChannel = `The Station is called ${details.station.name}. The showName is ${details.showName}. The date is ${details.date}.  The timeSlot is ${details.timeSlot}.`;
  let personalization = [`Address ${details.name} as your primary listener.`];

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
      prompt: `${djStyle} ${songInto} ${getRandomElement(
        djTopics
      )}\n\n INSTRUCTIONS:\n${djCoreInstructions}\n\nCONTEXT:\nDJ Name: ${djName}\n${djChannel}`,
      frequency: 1,
    },
    type2: {
      prompt: `${djStyle} ${songInto}\n\n INSTRUCTIONS:\n${djCoreInstructions}\n9. ${getRandomElement(
        djTopics
      )}\n\nCONTEXT:\nDJ Name: ${djName}\nDJ Background: ${context}`,
      frequency: 1,
    },
    type3: {
      prompt: `${djStyle} ${songInto}\n\n INSTRUCTIONS:\n${djCoreInstructions}\n10. ${getRandomElement(
        personalization
      )}`,
      frequency: 1,
    },
  };
}

module.exports = { constructPromptListWithCounts };
