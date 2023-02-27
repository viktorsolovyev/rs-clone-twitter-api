const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models");
const mock = require("./app/utils/mock");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const webSocketServer = new WebSocket.Server({ server, clientTracking: true });

const corsOptions = {
  origin: ["http://localhost:8081", "https://threetter.netlify.app"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to rs-clone-twitter-api application." });
});

webSocketServer.on("connection", (ws, req) => {
  ws.on("message", (message) => {
    console.log("received: %s", message);
    ws.send(`Hello, you sent -> ${message}`);
  });

  ws.send("Hi there, I am a WebSocket server");
});

db.sequelize
  .sync()
  .then(() => {
    console.log("Drop and Resync Db");
   // mock.addMockData();
  })
  .catch((err) => console.log(err));

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/tweet.routes")(app);
require("./app/routes/follower.routes")(app);
require("./app/routes/like.routes")(app);
require("./app/routes/view.routes")(app);

const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
