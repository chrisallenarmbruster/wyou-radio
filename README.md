# WYOU Radio

## Overview

WYOU Radio is an innovative AI-driven music application that transforms Spotify music streams into a personalized radio experience, complete with AI DJs. This full-stack app integrates advanced AI technologies to generate dynamic DJ dialogues that accompany a live Spotify stream, creating an immersive and interactive listening experience.

[![WYOU-Radio Composite](/public/images/screenshots/wyou-radio-composite.png)](https://portfolio.rev4labs.com/audio/wyou-samples/broadcast-demo-rusty.mp3)

<br>

## Listen to Broadcast Sample

### [Click to Play Broadcast Demo 📻 🎵 🔊](https://portfolio.rev4labs.com/audio/wyou-samples/broadcast-demo-rusty.mp3)

This is a sample of a WYOU Radio broadcast. It features AI disc jockey Rusty Maddox, a WYOU Radio personality, whose unscripted narrative and voice were generated on-the-fly by this app using AI technologies to accompany and mix with a live Spotify music stream.

**Note:** _The volume may need to be adjusted in the player control._

### Meet the WYOU AI DJs

- [M-Quake](https://portfolio.rev4labs.com/audio/wyou-samples/dj-history-demo-mquake.mp3)
- [Lady Lyric](https://portfolio.rev4labs.com/audio/wyou-samples/dj-segue-demo-ladylyric.mp3)
- [Rusty Maddox](https://portfolio.rev4labs.com/audio/wyou-samples/dj-segue-demo-rusty-joan-jett.mp3)
- [Nigel Windsor](https://portfolio.rev4labs.com/audio/wyou-samples/dj-weather-demo-nigel.mp3)

<br>

## Key Features

- **Personalized AI Radio**: Leveraging AI to create a unique radio experience with dynamically generated DJ dialogues.
- **Spotify Integration**: Seamlessly streams music from Spotify, allowing users to enjoy their favorite tracks.
- **Custom Audio Mixer**: A sophisticated mixer for cuing and blending DJ voice tracks with music.
- **On-the-fly Script Generation**: Utilizes LangChain, OpenAI, and ElevenLabs for real-time script and voice track generation.

<br>

## Screenshots

### Select a Disc Jockey

![Select a DJ](/public/images/screenshots/select-dj-rusty.png)

<br>

### Select Music

![Select Music](/public/images/screenshots/carousel.png)

<br>

### Now Playing

![Now Playing](/public/images/screenshots/now-playing-mquake.png)

<br>

## Watch the Project Video

Here is a link to the project video hosted by the WYOU AI disc jockey personalities and, as always, unscripted.

[WYOU Radio Project Video](https://vimeo.com/869263029/f6f59850b1?share=copy)

<br>

## Technologies

- **Frontend**: React/Redux for a Single Page Application (SPA) design.
- **Backend**: Node.js and Express.
- **AI and Voice Generation**: LangChain, OpenAI, and ElevenLabs.
- **Database**: PostgreSQL.
- **Music Streaming**: Spotify API.

<br>

## Getting Started

### Requirements

- Node.js
- PostgreSQL
- Spotify Developer Account with Client ID and Client Secret
- API keys for OpenAI, LangChain, ElevenLabs and Open Weather

### Installation

- Clone this repo.
- Run "npm install".
- Configure the Spotify API redirect URIs in your Spotify Developer Dashboard.
- Create a .env file in the local root directory of the repo or set environment variables accordingly. See .envSample for required environment variables. You will need to specify API keys for OpenAI, LangChain, ElevenLabs and Open Weather as well as your Spotify client ID and client secret. Set your Spotify Redirect URIs and the port you want to run the server on.
- Create a PostgreSQL database named "wyou-radio" and set the DATABASE_URL environment variable to the PostgreSQL connection string. Edit the seed.js file in the server/db directory to include your Spotify user email. Run the seed.js file to seed the database (i.e. "node seed.js").

### Usage

- Run "npm run start:prod"
- Navigate to the app in your browser. If running locally, localhost and the port you specified in your .env file in your browser (e.g. localhost:3000). If deployed, navigate to the URL (e.g. https://some_domain).
- Login with your Spotify account.
- Select a DJ.
- Select music.
- Enjoy!
- Note: you can toggle line 166 in the client/Components/Radio.js file to turn on or off the DJ related API calls.

<br>

## Engineers

- [Chris Armbruster](https://github.com/chrisallenarmbruster)
- [Joel Janov](https://github.com/https://github.com/jejanov)

<br>

## License

Copyright (c) 2023 Rev4Labs

This project is MIT licensed.
