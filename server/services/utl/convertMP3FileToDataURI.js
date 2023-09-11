const fs = require("fs");

async function convertMP3FileToDataURI(filePath) {
  try {
    const mp3Data = await fs.promises.readFile(filePath);
    const base64Data = mp3Data.toString("base64");
    const dataURI = `data:audio/mpeg;base64, ${base64Data}`;
    return dataURI;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

module.exports = {
  convertMP3FileToDataURI,
};
