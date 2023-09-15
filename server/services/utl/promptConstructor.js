const { getRandomElement } = require("../utl/randomElement");
const {
  constructPromptListWithCounts,
} = require("../utl/promptListConstructor");

async function songPrompts(
  radioStation,
  showName,
  songName,
  bandName,
  date,
  timeSlot,
  name,
  djId,
  station
) {
  const details = {
    radioStation,
    showName,
    songName,
    bandName,
    date,
    timeSlot,
    name,
    djId,
    station,
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

  const promptListWithCounts = await constructPromptListWithCounts(details);

  const resultArray = createPromptsArray(promptListWithCounts);
  console.log(resultArray);

  return getRandomElement(resultArray);
}

module.exports = { songPrompts };
