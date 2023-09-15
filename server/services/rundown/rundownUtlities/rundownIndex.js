const Tracks = require("../../../db/Tracks");

async function getCurrentRundownIndex(userEmail) {
  console.log(userEmail);
  const userTracks = await Tracks.findOne({ where: { userEmail: userEmail } });
  return userTracks ? userTracks.currentRundownIndex : 0;
}

async function updateCurrentRundownIndex(userEmail, index) {
  await Tracks.update(
    { currentRundownIndex: index },
    { where: { userEmail: userEmail } }
  );
}

module.exports = { getCurrentRundownIndex, updateCurrentRundownIndex };
