// Server Code

const express = require('express');
const cors = require('cors');
const socketio = require('socket.io');
const mongoose = require('mongoose');

const Game = require('./Models/Game');
const QuotesAPI = require('./QuotesAPI.js');

const app = express();
const port = 3001;

// Sets up an Express application and configures CORS to allow requests from a frontend hosted at http://localhost:3000
const corsOptions = {
  origin: 'https://typeracer712.netlify.app',
  methods: 'GET,POST',
  credentials: true,
};

app.use(cors(corsOptions));

// Connects to a MongoDB database using Mongoose. It prints a success message if the connection is successful and logs any errors.
const uri = "mongodb+srv://rishabhpoikayil:xjU3Pg2DF6QlYzIR@typeracer.k37rdcd.mongodb.net/?retryWrites=true&w=majority&appName=typeracer";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function connectToDatabase() {
  try {
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Successfully connected to database!");
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

connectToDatabase();

// Starts an HTTP server on port 3001 and sets up Socket.io for real-time communication with the same CORS options.
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const io = socketio(server, {
  cors: {
    origin: 'https://typeracer712.netlify.app',
    methods: ['GET', 'POST'],
    credentials: true 
  }
});

// Socket.io Event Handlers
io.on('connection', (socket) => {

  // userInput: Handles user input during the game. It checks if the input matches the current word and updates the player's
  // progress. If the player finishes, it calculates WPM (Words Per Minute) and emits updates to the clients.
  socket.on('userInput', async({userInput, gameID}) => {
    try {
      let game = await Game.findById(gameID);
      if(!game.isOpen && !game.isOver) {
        let player = game.players.find(player => player.socketID == socket.id);
        let word = game.words[player.currentWordIndex];

        if (word === userInput) {
          player.currentWordIndex++;
          if(player.currentWordIndex !== game.words.length) {
            game = await game.save();
            io.to(gameID).emit('updateGame', game);
          }
          else {
            let endTime = new Date().getTime();
            let {startTime} = game;
            player.WPM = calculateWPM(endTime, startTime, player);
            game = await game.save();
            socket.emit('done');
            io.to(gameID).emit('updateGame', game);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  });

  // timer: Handles the game start countdown. Only the party leader can start the game, and a countdown timer is displayed 
  // to all players. When the countdown ends, the game starts, and the game state is updated.
  socket.on('timer', async({gameID, playerID}) => {
    let countDown = 5;
    let game = await Game.findById(gameID);
    let player = game.players.id(playerID);
    if(player.isPartyLeader) {
      let timerID = setInterval(async() => {
        if (countDown >= 0) {
          io.to(gameID) .emit('timer', {countDown, msg : "Starting Game"});
          countDown--;
        }
        else {
          game.isOpen = false;
          game = await game.save();
          io.to(gameID).emit('updateGame', game);
          startGameClock(gameID);
          clearInterval(timerID);
        }
      }, 1000);
    }
  });

  // join-game: Allows a player to join an open game using a game ID and nickname. The player is added to the game, 
  // and the game state is updated for all players.
  socket.on('join-game', async({gameID: _id, nickName}) => {
    try {
      let game = await Game.findById(_id);
      if (game.isOpen) {
        const gameID = game._id.toString();
        socket.join(gameID);
        let player = {
          socketID: socket.id,
          nickName
        }
        game.players.push(player);
        game = await game.save();
        io.to(gameID).emit('updateGame', game);
      }
    } catch(err) {
      console.log(err);
    }
  })

  // create-game: Allows a player to create a new game. It fetches words from the ZenQuotes API, initializes a new game instance, 
  // and assigns the creator as the party leader. The game state is emitted to all players in the room.
  socket.on('create-game', async (nickName) => {
      try {
          const quotableData = await QuotesAPI();

          let game = new Game();
          game.words = quotableData;

          let player = {
              socketID: socket.id,
              isPartyLeader: true,
              nickName
          };

          game.players.push(player);
          game = await game.save();

          const gameID = game._id.toString();
          socket.join(gameID);

          io.to(gameID).emit('updateGame', game);
          console.log(`Game created with ID: ${gameID} and player: ${nickName}`);
      } catch (err) {
          console.error('Error creating game:', err);
          socket.emit('error', 'An error occurred while creating the game.');
      }
  });
});

// HELPER FUNCTIONS

// startGameClock: Starts the game clock and sends periodic updates to the clients. When the timer runs out, the game is marked as over, 
// and WPM is calculated for all players.
const startGameClock = async (gameID) => {
  let game = await Game.findById(gameID);
  game.startTime = new Date().getTime();
  game = await game.save();
  let time = 60;

  let timerID = setInterval(function gameIntervalFunc() {
    if (time >= 0) {
      const formatTime = calculateTime(time);
      io.to(gameID).emit('timer', {countDown: formatTime, msg: "Time Remaining"});
      time--;
    }
    else {
      (async () => {
        let endTime = new Date().getTime();
        let game = await Game.findById(gameID);
        let {startTime} = game;
        game.isOver = true;

        game.players.forEach((player, index) => {
          if(player.WPM === -1)
            game.players[index].WPM = calculateWPM(endTime, startTime, player);
        });
        game = await game.save();
        io.to(gameID).emit('updateGame', game);
        clearInterval(timerID);
      })()
    }
    return gameIntervalFunc;
  }(), 1000);
}

// calculateTime: Formats the remaining time into a "minutes" format.
const calculateTime = (time) => {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;
  return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

// calculateWPM: Calculates the player's Words Per Minute (WPM) based on the number of words typed and the elapsed time.
const calculateWPM = (endTime, startTime, player) => {
  let numOfWords = player.currentWordIndex;
  const timeInSeconds = (endTime - startTime) / 1000;
  const timeInMinutes = timeInSeconds / 60;
  const WPM = Math.floor(numOfWords / timeInMinutes);
  return WPM;
}