const axios = require("axios");
const fs = require("fs");
const path = require("path");

const CHUNK_SIZE = 1024;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const projectRoot = path.resolve(__dirname, "../../");

const headers = {
  Accept: "audio/mpeg",
  "Content-Type": "application/json",
  "xi-api-key": ELEVENLABS_API_KEY,
};

const saveStreamToFile = (stream, filePath) => {
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filePath);
    stream.on("error", reject);
    stream.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

function removeSpecialCharacters(str) {
  return str.replace(/[^a-zA-Z0-9 ]/g, "");
}

const fetchSpeech =async (voiceID, text, fileName) => {
  if (!ELEVENLABS_API_KEY) throw new Error("ELEVENLABS_API_KEY is missing.");
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
    await fs.promises.mkdir(path.join(projectRoot, "public/audio"), { recursive: true });
    await saveStreamToFile(
      response.data,
      path.join(projectRoot, "public/audio", `${fileName}.mp3`)
    );
    console.log("File saved successfully.");
    return {fileName: path.join(projectRoot, "public/audio", `${fileName}.mp3`), text: text};
  } catch (error) {
    throw new Error(`Speech generation failed (${error.response?.status || error.code || "unknown"}).`);
  }
};

module.exports = {
  fetchSpeech,
};
