// Setup an endpoint that the frontend can call
const router = require("express").Router();



const {
  next,
  reset,
  addPlaylistToRundown,
} = require("../services/rundown/rundown");

router.get("/next-content", async (req, res) => {
  const { playlist } = req.body;
  const showWithSongs = addPlaylistToRundown(playlist);
  let content = await next(showWithSongs);
  res.json(content);
});

router.get("/reset", (req, res) => {
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
