const express = require("express");
const cors = require("cors");


const app = express();
const session = require('express-session');

global.__basedir = __dirname;

var corsOptions = {
  origin: "*",
};

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: { origin: "*" },
});

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'jobs'
}));

const db = require("./app/models");

db.mongoose.set('strictQuery',false);
db.mongoose
  .connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database.");
  })
  .catch((error) => {
    console.log("Cannot connect to the database!", error.message);
    process.exit();
  });

app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

require("./app/routes/admin.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/social.routes")(app);
require("./app/routes/authenticated.routes")(app);
require("./app/routes/crud.routes")(app);
require("./app/routes/jobs.routes")(app);
require("./app/routes/applications.routes")(app);
require("./app/routes/messages.routes")(app);

io.on("connection", (socket) => {
  console.log("a user connected!", socket.id);

  socket.on("message", (message) => {
    io.emit("message", `${JSON.stringify(message)}`);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected!");
  });
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
