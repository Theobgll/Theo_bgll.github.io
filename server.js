// server.js
const WebSocket = require('ws');

const PORT = process.env.PORT || 3000;
const wss = new WebSocket.Server({ port: PORT });

let clients = [];

wss.on('connection', (ws) => {
  clients.push(ws);
  console.log('Client connecté. Total :', clients.length);

  ws.on('message', (message) => {
    // Relaye le message à tous les autres clients
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    clients = clients.filter(c => c !== ws);
    console.log('Client déconnecté. Total :', clients.length);
  });

  ws.on('error', (err) => {
    console.log('Erreur WS:', err);
  });
});

console.log(`Serveur WebSocket en écoute sur le port ${PORT}`);
