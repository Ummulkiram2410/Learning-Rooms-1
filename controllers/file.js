const mongoose = require("mongoose");
const path = require('path');
const fs = require('fs');
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
  const filepath = req.file.path
  const channelNames = req.body.channelName;
  const name = req.session.user.username;
  console.log(name);

  console.log("channels : ", channelNames);

  console.log(filepath);

  const file = new File({
    title: title,
    fileUrl: filepath,
    email: req.session.user.email,
    name: name
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

exports.downloadFile = (req, res, next) => {
    const fileId = req.params.noteId;
    console.log("fileId-", fileId)
    const filepath = path.join(__dirname, "/../", "Notefiles", fileId);
    console.log("filepath:", filepath);
    fs.readFile(filepath, (err, data)=>{
      if(err){
        return next(err);
      }
      res.send(data);
    })
}
