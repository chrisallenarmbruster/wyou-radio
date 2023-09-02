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
const voiceID = "21m00Tcm4TlvDq8ikWAM";


async function main() {
  const result = await predictMessages([
    new HumanMessage(
      "Create a paragraph with no titles or headings that refelects verbatum what a disk jockey would say to tee up the Sweet child o mine by guns and roses song on a classic rock radio station."
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

main();
