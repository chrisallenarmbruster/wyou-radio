const createContent = require("../createContent");
const createWeather = require("../createWeather");
// const createTalk = require("../createTalk");
// const createNews = require("../createNews");

// Playlist?
// this.intro = createContent(
//   radioStation,
//   showName,
//   songName,
//   bandName,
//   date,
//   timeSlot
// );
// this.content = null;

class RadioRundown {
  constructor(radioStation, showName, playList, date, timeSlot) {
    this.radioStation = radioStation;
    this.showName = showName;
    this.date = date;
    this.timeSlot = timeSlot;
    this.playList = playList;
    this.segments = [];
  }

  setContent(type) {
    if (type === "weather") {
      this.content = createWeather();
    } else if (type === "song") {
      this.content = createContent(
        radioStation,
        showName,
        songName,
        bandName,
        date,
        timeSlot
      );
    } else if (type === "talk_show") {
      // this.content = createTalk();
    } else if (type === "news") {
      // this.content = createNews();
    } else {
      console.warn(`Invalid content type: ${type}`);
    }
  }

  addSegment(type, songName, bandName, details = null, songDuration = null) {
    let duration;

    if (type === "song") {
      duration = songDuration;
    } else if (type === "talk_show" || type === "weather" || type === "news") {
      if (!this.content || this.content.type !== type) {
        console.warn(
          `Content for ${type} hasn't been set. Use setContent() before adding this segment.`
        );
        return;
      }
      duration = this.content.duration;
      details = this.content.details; // Pulling details from this.content
    } else if (type === "intro" || type === "outro") {
      duration = this.intro.duration;
    } else {
      console.warn(`Invalid segment type: ${type}`);
      return;
    }

    const startTime = this.segments.length
      ? this.segments[this.segments.length - 1].endTime
      : this.timeSlot.split(" - ")[0];
    const endTime = this.calculateEndTime(startTime, duration);

    const segment = {
      startTime: startTime,
      endTime: endTime,
      type: type,
      details: details,
    };

    this.segments.push(segment);
  }

  calculateEndTime(startTime, duration) {
    let [hours, minutes] = startTime.split(":").map(Number);
    minutes += duration;
    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;

    return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
  }

  getRundown() {
    return {
      radioStation: this.radioStation,
      showName: this.showName,
      date: this.date,
      timeSlot: this.timeSlot,
      segments: this.segments,
    };
  }
}

const myShow = new RadioRundown(
  "1-2-3 FM",
  "Rock Retrospectives with DJ Spike",
  "2023-09-01",
  "7:00 AM - 8:00 AM"
);

playList.forEach((element) => {
  // this needs to interweave the playlist with the show rundown? Or should this all be JIT?
  // What will get the best results from the AI?
  // Can we just pass the playlist to the AI and have it generate the rundown?
});

myShow.addSegment(
  "intro",
  "Wake up and smell the vinyl, it's 1-2-3 FM! Top of the morning..."
);
myShow.setContent("weather");
myShow.addSegment("weather", "Weather update for the day.");
myShow.addSegment(
  "song",
  { title: "Stairway to Heaven", artist: "Led Zeppelin" },
  8
);

console.log(myShow.getRundown());
