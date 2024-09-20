const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const port = 80;

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

// Create an HTTP server
const server = http.createServer(app);

// Initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('New client connected');

  // Send a message to the client upon connection
  ws.send('Welcome to the WebSocket server!');

  // Receive messages from the client
  ws.on('message', (message) => {
    console.log('Received: %s', message);
    // Broadcast the message to all clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Server broadcast: ${message}`);
      }
    });
  });

  // Handle WebSocket client disconnect
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});