const router = require("express").Router();
const Tracks = require("../db/Tracks");
const JamSession = require("../db/JamSession");
const { User } = require("../db/index.js");
const { djCharacters } = require("../services/djCharacters");
const { showRunner } = require("../services/rundown/showRunner");
const { reset } = require("../services/rundown/rundownUtlities/dbUtilities");

router.post("/next-content", async (req, res) => {
  const userEmail = req.session.email;
  //TODO: Update to use djId from req.body
  const { curTrack, nextTrack, jamSessionId, djId, station } = req.body;

  const user = await User.findOne({
    where: {
      email: userEmail,
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

  const content = await showRunner(
    userEmail,
    jamSessionId,
    user.display_name,
    djId,
    station
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

router.get("/dj-characters", async (req, res) => {
  const characterDetails = await djCharacters();

  if (characterDetails) {
    res.json(characterDetails);
  } else {
    res.status(404).send("Character not found");
  }
});

module.exports = router;
