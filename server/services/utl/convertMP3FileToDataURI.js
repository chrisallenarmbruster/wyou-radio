const fs = require("fs");

async function convertFileToDataURI(filePath, fileType) {
  try {
    const fileData = await fs.promises.readFile(filePath);
    const base64Data = fileData.toString("base64");
    let mimeType;

    switch (fileType) {
      case "png":
        mimeType = "image/png";
        break;
      case "mp3":
        mimeType = "audio/mpeg";
        break;
      default:
        throw new Error("Unsupported file type");
    }

    const dataURI = `data:${mimeType};base64,${base64Data}`;
    return dataURI;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

module.exports = {
  convertFileToDataURI,
};
