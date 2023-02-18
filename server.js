const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models");
const mock = require("./app/utils/mock");

const app = express();

const corsOptions = {
  origin: ["http://localhost:8081", "https://threetter.netlify.app/"]
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
  
app.get("/", (req, res) => {
  res.json({ message: "Welcome to rs-clone-twitter-api application." });
});

db.sequelize.sync({ force: true }).then(() => {
    console.log("Drop and Resync Db");    
    mock.addMockData();
  })
  .catch((err) => console.log(err));

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/tweet.routes')(app);
require('./app/routes/follower.routes')(app);
require('./app/routes/like.routes')(app);
require('./app/routes/view.routes')(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
