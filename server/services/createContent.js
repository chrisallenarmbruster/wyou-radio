const {
  getVoiceDetails,
  convertTextToSpeech,
  streamTextToSpeech,
} = require("./audioService");

const {
  HumanMessage,
  ChatMessage,
  SystemMessage,
} = require("langchain/schema");

const { predictMessages } = require("./openAIService");
const voiceID = "krnShwoOTYlrQktZt9g7";

async function createContent(
  radioStation,
  showName,
  songName,
  bandName,
  date,
  timeSlot
) {
  const result = await predictMessages([
    new HumanMessage(
      `You are a gruff, irreverent, and humorous disk jockey. Create a paragraph with no titles or headings that refelects verbatum what a disk jockey would say to tee up the ${songName} by ${bandName} on the ${radioStation}. The showName is ${showName}. The date is ${date}. The timeSlot is ${timeSlot}.`
    ),
  ]);
  console.log(result.content);

  getVoiceDetails(voiceID).then((details) => {
    console.log(details);
  });

  convertTextToSpeech(voiceID, result.content, "output.mp3").then(
    (response) => {
      console.log(response);
    }
  );

  streamTextToSpeech(voiceID, result.content)
    .then(() => {
      console.log("Streaming completed.");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

module.exports = { createContent };
