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
const { saveDebugTrackerToFile } = require("./utl/debugTracker");
const { getRandomElement } = require("./utl/randomElement");
const {
  constructPromptListWithCounts,
} = require("./utl/promptListConstructor");

const chat = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4",
  temperature: 1.3,
});

const template = `The following is a transcript of everything said by you, a disk jockey. The Human is prompting you on what to say and how. It is important that the you not be repetative and that you remembers what you have said previosly throughout the show. Do not describe yourself by the words used by the human to describe you. Do not introduce yourself more than once during the show. Do not say your name more than once.`;

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

const voiceID = "krnShwoOTYlrQktZt9g7";

function songPrompts(
  radioStation,
  showName,
  songName,
  bandName,
  date,
  timeSlot,
  name,
  songPrompts
) {
  const details = {
    radioStation,
    showName,
    songName,
    bandName,
    date,
    timeSlot,
    name,
    songPrompts,
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

  const promptListWithCounts = constructPromptListWithCounts(details);

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
  timeSlot,
  name,
  djName,
  weather
) {
  try {
    debugTracker.push({ memory: await memory.chatHistory.getMessages() });
    let result;
    if (weather) {
      result = await chain.call({
        input: weather,
      });
    } else {
      result = await chain.call({
        input: songPrompts(
          radioStation,
          showName,
          songName,
          bandName,
          date,
          timeSlot,
          name,
          djName
        ),
      });
    }

    saveDebugTrackerToFile(debugTracker);
    const timestamp = Date.now();

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
