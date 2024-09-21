const express = require('express');
const path = require('path');
// const http = require('http');

// const fs = require('fs');
const fs = require('fs/promises'); // Use the promises version of fs

const WebSocket = require('ws');

// const helper = require('./helper');  // Import helper.js

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

// Store connected clients with their IP address
const clients = new Map();

function sendPing() {
  wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
          const ip = clients.get(client);  // Get the stored IP for this client
          console.log(`# Sending Ping to client at IP: ${ip}`);
          client.ping();  // Send a ping
      }
  });
}

// Start the ping interval
const pingInterval = setInterval(sendPing, 5000);  // Ping every 3 seconds

// Initialize WebSocket server
const wss = new WebSocket.Server({ port: 3001, paht: "/ws" });

// WebSocket event handling
wss.on('connection', async (ws, req) => {
  const connected_ip = req.socket.remoteAddress;  // Get the client's IP address
  console.log(`Client connected from IP: ${connected_ip}`);

  // Store the client along with their IP
  clients.set(ws, connected_ip);

  // Event listener for incoming messages
  ws.on('message', async (message) => {
    console.log('Received message:', message.toString());

    try {
      var dataJson = JSON.parse(message);
      if (dataJson["Type"] == "Settings") {
          if (dataJson) {
              if (dataJson["Action"] === "read") {
                  // Read settings from file
                  var readFileData = await fs.readFile('./settings.json', 'utf-8'); // Add 'utf-8' to get the file content as a string
                  // client.send(readFile); // Send the file content directly
                  message = readFileData
              }
              if (dataJson["Action"] === "write") {
                  var jsonString = JSON.stringify(dataJson, null, 2); // Format the JSON
                  // Write the message to a file
                  await fs.writeFile('./settings.json', jsonString);
                  console.log('Settings saved to file.');
              }
          }
      }
    } catch (error) {
        console.error('Error writing to file:', error);
    }

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