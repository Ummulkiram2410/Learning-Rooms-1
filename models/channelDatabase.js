const mongoose = require("mongoose");

var conn = mongoose.Collection;

//const Schema = mongoose.Schema;

const Schema = mongoose.Schema;

const channelsSchema = new Schema({
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});
const channels = mongoose.model("channels", channelsSchema);
module.exports = channels;
