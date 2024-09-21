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

// Function to send ping to all clients
function sendPing() {
  wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
          client.ping();  // Send a ping
      }
  });
}

// Start the ping interval
const pingInterval = setInterval(sendPing, 3000);  // Ping every 3 seconds

// Initialize WebSocket server
const wss = new WebSocket.Server({ port: 3001, paht: "/ws" });

// WebSocket event handling
wss.on('connection', (ws, req) => {
  const connected_ip = req.socket.remoteAddress;  // Get the client's IP address
  console.log(`Client connected from IP: ${connected_ip}`);

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
  ws.on('close', (code, reason) => {
    console.log(`A client ${connected_ip} disconnected. Code: ${code}, Reason: ${reason}`);
  });

    ws.on('error', (error) => {
      console.log('WebSocket error: ', error);
  });

});