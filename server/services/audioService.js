const axios = require("axios");
const fs = require("fs");
const path = require("path");

const CHUNK_SIZE = 1024;
const ELEVENLABS_API_KEY = "1551af0ac5ade77c4647de014e9636b2";
const projectRoot = path.resolve(__dirname, "../");

const headers = {
  Accept: "audio/mpeg",
  "Content-Type": "application/json",
  "xi-api-key": ELEVENLABS_API_KEY,
};

const saveStreamToFile = (stream, filePath) => {
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filePath);
    stream.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

function removeSpecialCharacters(str) {
  return str.replace(/[^a-zA-Z0-9 ]/g, "");
}

const fetchSpeech = async (voiceID, text, fileName) => {
  fileName = removeSpecialCharacters(fileName);

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceID}`;
  const data = {
    text: text,
    model_id: "eleven_monolingual_v1",
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.5,
    },
  };
  try {
    const response = await axios.post(url, data, {
      headers: headers,
      responseType: "stream",
    });
    await saveStreamToFile(
      response.data,
      path.join(projectRoot, "public/audio", `${fileName}.mp3`)
    );
    console.log("File saved successfully.");
    return path.join(projectRoot, "public/audio", `${fileName}.mp3`);
  } catch (error) {
    console.error("Error:", error);
  }
};

module.exports = {
  fetchSpeech,
};
