// Setup an endpoint that the frontend can call
const router = require("express").Router();
const {
  currentContent,
  showWithSongs,
} = require("../services/rundown/rundown");

router.get("/next-content", (req, res) => {
  let content = currentContent.next(showWithSongs);

  res.json(content);
});

router.get("/reset", (req, res) => {
  currentContent.reset();
  res.send("Rundown index reset!");
});

router.post("/add-playlist", (req, res) => {
  const playlist = req.body;

  if (!playlist) {
    return res.status(400).send("Playlist is required");
  }

  let updatedShow = addPlaylistToRundown(showWithSongs, playlist);

  res.json(updatedShow);
});

module.exports = router;
