const fs = require("fs");

function saveDebugTrackerToFile(debugTracker) {
  const data = `${JSON.stringify(debugTracker)}`;
  fs.writeFile("./debug/debugTracker.json", data, (err) => {
    if (err) throw err;
    console.log("Debug tracker saved to file.");
  });
}

module.exports = {
  saveDebugTrackerToFile,
};
