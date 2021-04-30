const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const channelNoteSchema = Schema({
  code: {
    type: String,
    required: true,
  },
  noteId : {
    type : Schema.Types.ObjectId,
    ref : 'File',
    required: false
  }
});

module.exports = mongoose.model("ChannelNote", channelNoteSchema);
