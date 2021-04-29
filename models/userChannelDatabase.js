const mongoose = require("mongoose");

var conn = mongoose.Collection;

//const Schema = mongoose.Schema;

const Schema = mongoose.Schema;

const userChannelSchema = new Schema({
  code: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const userChannel = mongoose.model("userChannel", userChannelSchema);
module.exports = userChannel;
