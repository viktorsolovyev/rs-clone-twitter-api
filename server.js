import express from "express";
import { json, urlencoded } from "body-parser";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

app.use(json());
app.use(urlencoded({ extended: true }));

const db = require("./app/models");
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync Db");
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to rs-clone-twitter-api application." });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
