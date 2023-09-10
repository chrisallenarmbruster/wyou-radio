// Setup an endpoint that the frontend can call
const router = require("express").Router();
const Tracks = require("../db/Tracks"); // adjust the path to where your CurrentTracks model is located

const {
  reset,
  addPlaylistToRundown,
} = require("../services/rundown/rundown");

router.post("/next-content", async (req, res) => {
  const userEmail = req.session.email;
  const { curTrack, nextTrack } = req.body;

  await Tracks.upsert({
    userEmail: userEmail,
    curTrack: curTrack,
    nextTrack: nextTrack,
  });

  const content = await addPlaylistToRundown(userEmail);
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
