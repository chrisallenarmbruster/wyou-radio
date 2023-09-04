// Setup an endpoint that the frontend can call
const router = require("express").Router();
const path = require("path");
const fs = require("fs");

const {
  next,
  reset,
  addPlaylistToRundown,
} = require("../services/rundown/rundown");

router.get("/next-content", (req, res) => {
  const showWithSongs = addPlaylistToRundown(samplePlaylist);
  let content = next(showWithSongs);
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

router.get("/audio/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, filename);
  console.log(filePath);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found!");
  }

  const stat = fs.statSync(filePath);

  if (path.extname(filename) !== ".mp3") {
    return res.status(400).send("Not a valid audio file.");
  }

  res.writeHead(200, {
    "Content-Type": "audio/mpeg",
    "Content-Length": stat.size,
  });

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
});

module.exports = router;
