const mongoose = require("mongoose");

const { validationResult } = require("express-validator/check");

const channelDatabase = require("../models/channelDatabase");

const todo = require("../models/todoDatabase");

const userChannelDatabase = require("../models/userChannelDatabase");

const File = require("../models/file");
const ChannelNote = require("../models/channelNote");

const eventDatabase = require("../models/eventDatabase");
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
        name: name,
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
      const name = channel.name;
      console.log(name);
      const userChannel = new userChannelDatabase({
        email: req.session.user.email,
        code: code,
        name: name,
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
  var chnName = req.query.name;
  console.log(code);
  req.session.code = code;
  let firstquery = new Promise((resolve, reject) => {
    userChannelDatabase.find({ code: req.session.code }).then((channel) => {
      req.session.channelName = channel[0].name;
    });
  });

  let mytask = [];
  eventDatabase.find({ code: req.session.code }).then((tasks) => {
    req.session.code = code;
    mytask = tasks;
  });

  //var notefiles = [];
  ChannelNote.find({ code: code })
    .populate("noteId")
    .then((chn) => {
      //console.log("chn :", chn);
      //notefiles = chn;
      //console.log("notefiles :", chn);

      return res.render("insideChannel", {
        tasks: mytask,
        username: req.session.user.username,
        channelName: req.session.channelName,
        files: chn,
      });
    });

  //console.log("notefiles :", notefiles);
};

exports.events = (req, res, next) => {
  const events = new eventDatabase({
    code: req.session.code,
    task: req.body.task,
  });
  events
    .save()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
  return res.redirect("/channel/?code=" + req.session.code);
};

exports.eventdelete = (req, res, next) => {
  const id = req.params.id;
  console.log(req.session.code);
  eventDatabase.findByIdAndRemove(id, (err) => {
    if (err) return res.send(500, err);
    res.redirect("/channel/?code=" + req.session.code);
  });
};

exports.leaveChannel = (req, res, next) => {
  const email = req.session.user.email;
  userChannelDatabase.deleteOne(
    { email: email, code: req.session.code },
    function (err, obj) {
      if (err) throw err;
    }
  );
  res.redirect("/channels");
};
