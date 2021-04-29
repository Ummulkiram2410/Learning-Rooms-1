//const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");
//const csrf = require("csurf");

const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();
const Login = require("./routes/database");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(__dirname + "/public"));

const SignIn = require("./routes/SignIn");
const channels = require("./routes/channels");

app.get("/favicon.ico", (req, res) => res.status(204));

//app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({ secret: "my secret", resave: false, saveUninitialized: false })
);

app.use(flash());

app.use(SignIn);
app.use(channels);

//app.use(errorController.get404);
//const server = http.createServer(app);
//server.listen(3000);

mongoose.connect(
  "mongodb+srv://Ummulkiram:Password@cluster0.ruu7m.mongodb.net/LearningRoom?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log(" Mongoose is connected")
);
//const dbConnection = mongoose.connection;
app.listen(3000);
