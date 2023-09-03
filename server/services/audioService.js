const voice = require("elevenlabs-node");
const fs = require("fs-extra");
const play = require("play-sound")((opts = {}));
const fileName = "audio.mp3";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const getVoiceDetails = (voiceID) => {
  return voice.getVoice(apiKey, voiceID);
};

const convertTextToSpeech = (voiceID, textInput, outputFileName) => {
  return voice.textToSpeech(
    ELEVENLABS_API_KEY,
    voiceID,
    outputFileName,
    textInput
  );
};

const streamTextToSpeech = (voiceID, textInput) => {
  return new Promise((resolve, reject) => {
    voice
      .textToSpeechStream(ELEVENLABS_API_KEY, voiceID, textInput)
      .then((res) => {
        const writeStream = fs.createWriteStream(fileName);
        res.pipe(writeStream);

        writeStream.on("finish", () => {
          play.play(fileName, (err) => {
            if (err) reject(err);
            console.log("Audio playback finished.");
            resolve();
          });
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = {
  getVoiceDetails,
  convertTextToSpeech,
  streamTextToSpeech,
};
