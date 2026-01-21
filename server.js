const WebSocket = require("ws");

const PORT = process.env.PORT || 3000;
const wss = new WebSocket.Server({ port: PORT });

let admin = null;
let user = null;

wss.on("connection", (ws) => {

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    // ------------------------
    // JOIN
    // ------------------------
    if (data.type === "admin-join") {
      admin = ws;
      console.log("Admin connecté");
      return;
    }

    if (data.type === "user-join") {
      user = ws;
      console.log("User connecté");

      // Si l'admin est déjà connecté, on informe le user
      if (admin) {
        user.send(JSON.stringify({ type: "admin-ready" }));
      }
      return;
    }

    // ------------------------
    // OFFER / ANSWER / CANDIDATE
    // ------------------------
    if (data.type === "offer" && admin) {
      admin.send(JSON.stringify({ type: "offer", offer: data.offer }));
    }

    if (data.type === "answer" && user) {
      user.send(JSON.stringify({ type: "answer", answer: data.answer }));
    }

    if (data.type === "candidate") {
      // si ça vient du user
      if (ws === user && admin) {
        admin.send(JSON.stringify({ type: "candidate", candidate: data.candidate }));
      }

      // si ça vient de l'admin
      if (ws === admin && user) {
        user.send(JSON.stringify({ type: "candidate", candidate: data.candidate }));
      }
    }
  });

  ws.on("close", () => {
    if (ws === admin) admin = null;
    if (ws === user) user = null;
    console.log("Client déconnecté");
  });
});

console.log(`Serveur WebSocket en écoute sur le port ${PORT}`);
