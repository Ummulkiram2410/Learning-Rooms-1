const mongoose = require("mongoose");

const { validationResult } = require("express-validator/check");

const channelDatabase = require("../models/channelDatabase");

const todo = require("../models/todoDatabase");

const userChannelDatabase = require("../models/userChannelDatabase");
const session = require("express-session");

exports.getChannels = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  userChannelDatabase
    .find({ email: req.session.user.email })
    .then((channels) => {
      console.log(channels);
      return res.render("channels", {
        channels: channels,
        username: req.session.user.username,
        errorMessage: message,
      });
    });
  //return res.redirect("/channels");
};

exports.todo = (req, res, next) => {
  todo.find({ email: req.session.user.email }).then((tasks) => {
    return res.render("todo", { tasks: tasks });
  });
  // return res.render("todo", { tasks: [] });
};

exports.posttodo = (req, res, next) => {
  const ToDo = new todo({
    email: req.session.user.email,
    task: req.body.task,
  });
  ToDo.save()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
  return res.redirect("/to-do");
};

exports.delete = (req, res, next) => {
  const id = req.params.id;
  todo.findByIdAndRemove(id, (err) => {
    if (err) return res.send(500, err);
    res.redirect("/to-do");
  });
};
exports.createChannel = (req, res, next) => {
  const code = req.body.code;
  const name = req.body.name;
  channelDatabase.findOne({ code: code }).then((channel) => {
    if (!channel) {
      const Channel = new channelDatabase({
        code: code,
        name: name,
      });
      Channel.save()
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
      const UserChannel = new userChannelDatabase({
        email: req.session.user.email,
        code: code,
      });
      UserChannel.save()
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      req.flash("error", "Code already exists");
    }
    return res.redirect("/channels");
  });
};

exports.joinChannel = (req, res, next) => {
  const code = req.body.code;
  channelDatabase.findOne({ code: code }).then((channel) => {
    if (!channel) {
      req.flash("error", "No such channel exists.");
      return res.redirect("/channels");
    } else {
      const userChannel = new userChannelDatabase({
        email: session.user.email,
        code: code,
      });
      userChannel
        .save()
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
      return res.redirect("/channels");
    }
  });
};

exports.getChannel = (req, res, next) => {
  var code = req.query.code;
  console.log(code);
  req.session.code = code;
  channelDatabase.findOne({ code: code }).then((channel) => {
    //req.session.channel = channel;
    req.session.channelName = channel.name;
  });

  console.log(req.session.user.username);
  res.render("InsideChannel", { username: req.session.user.username });
};
