const WebSocket = require('ws');

const PORT = process.env.PORT || 3000;
const wss = new WebSocket.Server({ port: PORT });

let admin = null;
let user = null;

wss.on('connection', (ws) => {

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      // Définir admin / user
      if (data.type === 'admin-ready') {
        admin = ws;
        console.log("Admin connecté");
        return;
      }

      if (data.type === 'user-ready') {
        user = ws;
        console.log("User connecté");
        return;
      }

      // relay only between admin and user
      if (ws === admin && user && user.readyState === WebSocket.OPEN) {
        user.send(message);
      }

      if (ws === user && admin && admin.readyState === WebSocket.OPEN) {
        admin.send(message);
      }

    } catch (e) {
      console.log("Message non JSON ignoré");
    }
  });

  ws.on('close', () => {
    if (ws === admin) admin = null;
    if (ws === user) user = null;
  });
});

console.log(`Serveur WebSocket en écoute sur le port ${PORT}`);
