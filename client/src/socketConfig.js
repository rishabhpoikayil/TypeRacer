// Client-side connection to socket.io server

import io from 'socket.io-client';
const socket = io('https://typeracer-backend-w565.onrender.com');
export default socket;