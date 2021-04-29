const Msg = require("../models/chatmessage");

const express = require("express");
const app = express();

const session = require("express-session");

var http = require("http").Server(app);
var io = require("socket.io")(http);

exports.getMessage = (req, res, next) => {
  Msg.find({ channelId: req.session.code })
    .then((messages) => {
      res.send(messages);
    })
    .catch((err) => console.log(err));
};

exports.postMessage = async (req, res, next) => {
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
};
