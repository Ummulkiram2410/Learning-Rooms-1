//const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer");
const express = require("express");
//const csrf = require("csurf");

const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();
const Login = require("./models/database");

// Below 3 for chat
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(__dirname + "/public"));

const SignIn = require("./routes/SignIn");
const channels = require("./routes/channels");
const chats = require("./routes/chatRoutes");
const files = require("./routes/file");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Notefiles");
  },
  filename: (req, file, cb) => {
    cb(null, Math.random().toString(36).substr(2, 6) + "-" + file.originalname);
  },
});

app.get("/favicon.ico", (req, res) => res.status(204));

//app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage }).single("file"));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({ secret: "my secret", resave: false, saveUninitialized: false })
);

app.use(flash());

app.use(SignIn);
app.use(channels);
app.use(files);
//app.use(chats);  // Chats not updating with this... everything else works well.

//app.use(errorController.get404);
//const server = http.createServer(app);
//server.listen(3000);

// ======================= Chat Code START ===============================
const Msg = require("./models/chatmessage");

app.use("/channel", (req, res) => {
  res.render("insideChannel");
});

app.get("/messages", (req, res) => {
  Msg.find({ channelId: req.session.code })
    .then((messages) => {
      res.send(messages);
    })
    .catch((err) => console.log(err));
});

app.post("/messages", async (req, res) => {
  try {
    const name = req.body.name;
    const msg = req.body.message;
    const channelId = req.session.code;
    var message = new Msg({
      name: name,
      message: msg,
      channelId: channelId,
    });

    var savedMessage = await message.save();
    console.log("saved");

    var censored = await Msg.findOne({ message: "badword" });

    if (censored) await Msg.remove({ _id: censored.id });
    else io.emit("message", req.body);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
    return console.error(error);
  } finally {
    console.log("message post called");
  }
});

io.on("connection", (socket) => {
  console.log("a user has been connected");
});

// ======================= Chat Code END ===============================

// app.use()

const JoeyDB = "mongodb+srv://Jay:MongoDB.DB@cluster0.q00ek.mongodb.net/letsee";
const UmmulDB =
  "mongodb+srv://Ummulkiram:Password@cluster0.ruu7m.mongodb.net/LearningRoom?retryWrites=true&w=majority";

mongoose.connect(
  UmmulDB,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log(" Mongoose is connected")
);
//const dbConnection = mongoose.connection;

//app.listen(3000);

// ---------- Need this below for chat -----------------
var server = http.listen(3000, () => {
  console.log("server is listening on port", server.address().port);
});
