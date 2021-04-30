const mongoose = require("mongoose");
const session = require("express-session");

const File = require("../models/file");
const userChannelDatabase = require("../models/userChannelDatabase");

exports.getFile = (req, res, next) => {
  var channels = [];
  userChannelDatabase
    .find({ email: req.session.user.email })
    .then((channels) => {
      channels = channels;
    });
  File.find({ email: req.session.user.email }).then((file) => {
    //return res.render("notes", { file: file,channels: channels});
  });
  res.render("notes");
};

exports.postFile = (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const filepath = req.file.path;
  const userId = "Jaimin";
  const channelId = "id1";

  console.log(filepath);

  const file = new File({
    title: title,
    description: description,
    fileUrl: filepath,
    userId: "Jaimin",
    channelId: "Jaimin",
  });

  file
    .save()
    .then((result) => {
      console.log("File Added");
      res.redirect("/channel");
    })
    .catch((err) => {
      console.log(err);
    });
};
