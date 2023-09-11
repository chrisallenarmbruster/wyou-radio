const router = require("express").Router();
const Tracks = require("../db/Tracks");
const JamSession = require("../db/JamSession");

const { reset, addPlaylistToRundown } = require("../services/rundown/rundown");

router.post("/next-content", async (req, res) => {
  const userEmail = req.session.email;
  const { curTrack, nextTrack, jamSessionId } = req.body;

  let jamSession;

  if (jamSessionId) {
    jamSession = await JamSession.findOne({
      where: {
        jamSessionId: jamSessionId,
        userEmail: userEmail,
      },
    });
  }

  if (!jamSession) {
    jamSession = await JamSession.create({
      userEmail: userEmail,
      jamSessionId: jamSessionId,
    });
  }

  await Tracks.upsert({
    userEmail: userEmail,
    curTrack: curTrack,
    nextTrack: nextTrack,
  });

  const content = await addPlaylistToRundown(userEmail, jamSessionId);
  res.json(content);
});

router.post("/reset", (req, res) => {
  reset();
  res.send("Rundown index reset!");
});

router.post("/add-playlist", (req, res) => {
  const { playlist } = req.body;
  if (!playlist) {
    return res.status(400).send("Playlist is required");
  }
  let updatedShow = addPlaylistToRundown(playlist);
  res.json(updatedShow);
});

module.exports = router;
