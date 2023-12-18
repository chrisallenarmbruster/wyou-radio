# WYOU Radio

## Overview

WYOU Radio is an innovative AI-driven music application that transforms Spotify streams into a personalized radio experience, complete with AI DJs. This full-stack app integrates advanced AI technologies to generate dynamic DJ dialogues that accompany a live Spotify stream, creating an immersive and interactive listening experience.

![WYOU-Radio Composite](/public/images/screenshots/wyou-radio-composite.png)

## Listen to Sample Broadcast

<audio controls>
  <source src="/public/audio/samples/broadcast-demo-rusty.mp3" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>

## Key Features

- **Personalized AI Radio**: Leveraging AI to create a unique radio experience with dynamically generated DJ dialogues.
- **Spotify Integration**: Seamlessly streams music from Spotify, allowing users to enjoy their favorite tracks.
- **Custom Audio Mixer**: A sophisticated mixer for cuing and blending DJ voice tracks with music.
- **On-the-fly Script Generation**: Utilizes LangChain, OpenAI, and ElevenLabs for real-time script and voice track generation.

## Technologies

- **Frontend**: React/Redux for a Single Page Application (SPA) design.
- **Backend**: Node.js and Express.
- **AI and Voice Generation**: LangChain, OpenAI, and ElevenLabs.
- **Database**: PostgreSQL.
- **Music Streaming**: Spotify API.

## Getting Started

(Here, include instructions on how to install and run your application. This might include steps to clone the repo, install dependencies, and any necessary configuration.)

### Requirements

- Node.js
- PostgreSQL
- Spotify Developer Account with Client ID and Client Secret
- API keys for OpenAI, LangChain, ElevenLabs and Open Weather

### Installation

- Clone this repo.
- Run "npm install" in the local root directory of the repo.
- Configure the Spotify API redirect URIs in your Spotify Developer Dashboard.
- Create a .env file in the local root directory of the repo or set environment variables accordingly. See .envSample for required environment variables. You will need to specify API keys for OpenAI, LangChain, ElevenLabs and Open Weather as well as your Spotify client ID and client secret. Set your Spotify Redirect URIs and the port you want to run the server on.
- Create a PostgreSQL database named "wyou-radio" and set the DATABASE_URL environment variable to the PostgreSQL connection string. Edit the seed.js file in the server/db directory to include your Spotify user email. Run the seed.js file to seed the database (i.e. "node seed.js").

### Usage

- Run "npm run start:prod"
- Navigate to localhost and the port you specified in your .env file in your browser. (e.g. localhost:3000)
- Login with your Spotify account.
- Select a DJ.
- Select music.
- Enjoy!
- Note: you can toggle line 166 in the client/Components/Radio.js file to turn on or off the DJ related API calls.

## Authors

- [Chris Armbruster](https://github.com/chrisallenarmbruster)
- [Joel Janov](https://github.com/https://github.com/jejanov)

## License

Copyright (c) 2023 Rev4Labs

This project is MIT licensed.
