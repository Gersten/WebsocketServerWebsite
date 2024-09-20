const express = require('express');
const path = require('path');
// const http = require('http');
const WebSocket = require('ws');

const app = express();
const port = 3002;

// app.get('/', (req, res) => {
//   res.send('Hello World Bye !!!');
// });

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public_html')));

// Define routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public_html', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Initialize WebSocket server
const wss = new WebSocket.Server({ port: 3001, paht: "/ws" });

// WebSocket event handling
wss.on('connection', (ws) => {
  console.log('A new client connected.');

  // Event listener for incoming messages
  ws.on('message', (message) => {
    console.log('Received message:', message.toString());

    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  // Event listener for client disconnection
  ws.on('close', () => {
    console.log('A client disconnected.');
  });
});