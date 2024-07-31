# TypeRacer

## Overview

TypeRacer is a web-based typing game where users can compete to type a series of randomly selected words as quickly and accurately as possible. It supports real-time multiplayer gameplay, allowing users to create and join games, and tracks their typing speed in Words Per Minute (WPM). The game is hosted on Netlify (client) and Render (server).

## Features

- **Create and Join Games:** Users can create new games or join existing ones using a unique game code.
- **Real-Time Multiplayer:** Play against friends or other users in real-time.
- **Typing Speed Tracking:** Tracks and displays each player's Words Per Minute (WPM).
- **Countdown Timer:** A countdown timer before the game starts, managed by the person who created the game.
- **Scoreboard:** Displays the ranking of players based on their performance.

## Technologies Used

- **Frontend:**
  - **React:** A JavaScript library for building user interfaces.
  - **Bootstrap:** A CSS framework for responsive design.
  - **Socket.io-client:** For real-time communication with the backend.
  
- **Backend:**
  - **Express.js:** A web application framework for Node.js.
  - **Socket.io:** Enables real-time, bidirectional communication between clients and servers.
  - **Mongoose:** An Object Data Modeling (ODM) library for MongoDB and Node.js.
  - **MongoDB Atlas:** Cloud-hosted MongoDB database.

- **APIs:**
  - **ZenQuotes API:** Provides the typing text used in the game.

## Deployment

- **Frontend:** [Click here to play.](https://typeracer-phoenix.netlify.app)
- **Backend:** (https://typeracer-backend-w565.onrender.com)
