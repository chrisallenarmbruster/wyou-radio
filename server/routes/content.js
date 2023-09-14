const router = require("express").Router();
const Tracks = require("../db/Tracks");
const JamSession = require("../db/JamSession");
const { getLatLong } = require("../services/getLatLong");
const { djCharacters } = require("../services/djCharacters");

const { reset, addPlaylistToRundown } = require("../services/rundown/rundown");

router.post("/next-content", async (req, res) => {
  const userEmail = req.session.email;
  const { curTrack, nextTrack, jamSessionId, djName } = req.body;

  const profile = await Profile.findOne({
    where: {
      userEmail: userEmail,
    },
  });

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

  const content = await addPlaylistToRundown(
    userEmail,
    jamSessionId,
    profile,
    djName
  );
  res.json(content);
});

router.post("/reset", (req, res) => {
  reset();
  res.send("Rundown index reset!");
});

router.get("/dj-characters/:djId", (req, res) => {
  const djId = req.params.djId;

  const characterDetails = djCharacters(djId);

  if (characterDetails) {
    res.json(characterDetails);
  } else {
    res.status(404).send("Character not found");
  }
});

router.get("/dj-characters", (req, res) => {
  const characterDetails = djCharacters();

  if (characterDetails) {
    res.json(characterDetails);
  } else {
    res.status(404).send("Character not found");
  }
});

module.exports = router;
