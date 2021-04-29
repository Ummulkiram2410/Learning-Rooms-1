const mongoose = require('mongoose');

const File = require('../models/file');


exports.getFile = (req, res, next) => {
    res.render('file');
}

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
        userId : "Jaimin",
        channelId : "Jaimin" 
      });
      
      file
      .save()
      .then(result => {
      console.log('File Added');
      res.redirect('/channel');
      })
      .catch(err => {
      console.log(err);
      });

}