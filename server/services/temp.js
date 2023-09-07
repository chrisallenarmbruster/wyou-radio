const axios = require("axios");
const fs = require("fs");

const CHUNK_SIZE = 1024;
const url = "https://api.elevenlabs.io/v1/text-to-speech/krnShwoOTYlrQktZt9g7";

const headers = {
  Accept: "audio/mpeg",
  "Content-Type": "application/json",
  "xi-api-key": "1551af0ac5ade77c4647de014e9636b2",
};

const data = {
  text: "Hi! My name is Bella, nice to meet you!",
  model_id: "eleven_monolingual_v1",
  voice_settings: {
    stability: 0.5,
    similarity_boost: 0.5,
  },
};

const saveStreamToFile = (stream, filePath) => {
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filePath);
    stream.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

const fetchSpeech = async () => {
  try {
    const response = await axios.post(url, data, {
      headers: headers,
      responseType: "stream",
    });
    await saveStreamToFile(response.data, "output.mp3");
    console.log("File saved successfully.");
  } catch (error) {
    console.error("Error:", error);
  }
};

fetchSpeech();
