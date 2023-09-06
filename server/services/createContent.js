const { fetchSpeech } = require("./audioService");
const { ConversationChain } = require("langchain/chains");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
} = require("langchain/prompts");
const { BufferMemory } = require("langchain/memory");
const fs = require("fs");

const chat = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
  temperature: 1.3,
});

const template = `The following is a transcript of everything said by you, a disk jockey. The Human is prompting the you on what to say and how. It is important that the you not be repetative and that you remembers what you have said previosly throughout the show. Do not describe yourself by the words used by the human to describe you. Do not introduce yourself more than once during the show.`;

const chatPrompt = ChatPromptTemplate.fromPromptMessages([
  SystemMessagePromptTemplate.fromTemplate(template),
  new MessagesPlaceholder("history"),
  HumanMessagePromptTemplate.fromTemplate("{input}"),
]);
const memory = new BufferMemory({ returnMessages: true, memoryKey: "history" });

const chain = new ConversationChain({
  memory: memory,
  prompt: chatPrompt,
  llm: chat,
  verbose: true,
});

const debugTracker = [];
function saveDebugTrackerToFile(debugTracker) {
  const data = `${JSON.stringify(debugTracker)}`;
  fs.writeFile("./debug/debugTracker.json", data, (err) => {
    if (err) throw err;
    console.log("Debug tracker saved to file.");
  });
}

const {
  HumanMessage,
  ChatMessage,
  SystemMessage,
} = require("langchain/schema");

const { predictMessages } = require("./openAIService");
const voiceID = "krnShwoOTYlrQktZt9g7";

function getRandomElement(arr) {
  if (!arr.length) {
    throw new Error("Array is empty!");
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  debugTracker.push({ randomIndex: randomIndex });
  return arr[randomIndex];
}

function songPrompts(
  radioStation,
  showName,
  songName,
  bandName,
  date,
  timeSlot
) {
  //TODO: Make another list that is dynamic basic on a websearch for todays headllines

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

  //Can this be constructed as to remove repetion but keep the variability?
  const promptListWithCounts = {
    type1: {
      prompt: `You are a gruff, irreverent, and humorous disk jockey. Create a script with no titles or headings that reflects verbatim what a disk jockey would say to tee up the ${songName} by ${bandName} on the ${radioStation}. The showName is ${showName}. The date is ${date}.  The timeSlot is ${timeSlot}.  ${getRandomElement(
        djTopics
      )} Keeping in mind what you have said previously. Be creative and do not repeat yourself.`,
      frequency: 1,
    },
    type2: {
      prompt: `You are a gruff, irreverent, and humorous disk jockey. ${getRandomElement(
        djTopics
      )} Create a script with no titles or headings that reflects verbatim what a disk jockey would say to tee up the ${songName} by ${bandName} keeping in mind what you have said previously. Be creative and do not repeat yourself.`,
      frequency: 3,
    },
    type3: {
      prompt: `You are a gruff, irreverent, and humorous disk jockey. Be very brief. Create a script with no titles or headings that reflects verbatim what a disk jockey would say to tee up the ${songName} by ${bandName} keeping in mind what you have said previously. Be creative and do not repeat yourself.`,
      frequency: 2,
    },
  };

  function createPromptsArray(promptListWithCounts) {
    let promptsArray = [];

    for (const type in promptListWithCounts) {
      for (let i = 0; i < promptListWithCounts[type].frequency; i++) {
        promptsArray.push(promptListWithCounts[type].prompt);
      }
    }

    return promptsArray;
  }

  const resultArray = createPromptsArray(promptListWithCounts);
  console.log(resultArray);

  return getRandomElement(resultArray);
}

//TODO: Need to set this up to create Weather, News, etc. Also need to construct chat history.

async function createContent(
  radioStation,
  showName,
  songName,
  bandName,
  date,
  timeSlot
) {
  try {
    debugTracker.push({ memory: await memory.chatHistory.getMessages() });
    const result = await chain.call({
      input: songPrompts(
        radioStation,
        showName,
        songName,
        bandName,
        date,
        timeSlot
      ),
    });

    // await getVoiceDetails(voiceID).then((details) => {
    //   console.log(details);
    // });
    saveDebugTrackerToFile(debugTracker);
    const timestamp = Date.now();

    //NOTE: TURN THIS BACK ON
    const response = await fetchSpeech(
      voiceID,
      result.response,
      `${songName}_${bandName}_${timestamp}`
    );
    if (response === "error") {
      console.log(response);
      return;
    } else return response;

    // streamTextToSpeech(voiceID, result.content)
    //   .then(() => {
    //     console.log("Streaming completed.");
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //   });
  } catch (error) {
    console.log(error);
  }
}

module.exports = { createContent };
