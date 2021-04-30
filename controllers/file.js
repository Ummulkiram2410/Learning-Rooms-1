const mongoose = require("mongoose");
const session = require("express-session");

const File = require("../models/file");
const ChannelNote = require("../models/channelNote");
const userChannelDatabase = require("../models/userChannelDatabase");

exports.getFile = (req, res, next) => {
  var getChannels = [];
  userChannelDatabase
    .find({ email: req.session.user.email })
    .then((channel) => {
      channels = channel;
    });

  File.find({ email: req.session.user.email }).then((file) => {
    console.log("files:", file);
    console.log("channels :", channels);
    return res.render("notes", { files: file, channels: channels });
  });
  //res.render("notes");
};

exports.postFile = (req, res, next) => {
  const title = req.body.title;
  const filepath = req.file.path;
  const channelNames = req.body.channelName;
  const userId = "Jaimin";
  const channelId = "id1";

  console.log("channels : ", channelNames);

  console.log(filepath);

  const file = new File({
    title: title,
    fileUrl: filepath,
    email: req.session.user.email,
  });

  file
    .save()
    .then((result) => {
      console.log("File Added");
      console.log("file Id : ", file._id);
    })
    .catch((err) => {
      console.log(err);
    });

  for (i = 0; i < channelNames.length; i++) {
    let channelNote = new ChannelNote({
      code: channelNames[i],
      noteId: file,
    });

    channelNote
      .save()
      .then((result) => {
        console.log("Files added to channels");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  res.redirect("/file");
};
