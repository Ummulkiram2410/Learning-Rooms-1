const mongoose = require("mongoose");

var conn = mongoose.Collection;

//const Schema = mongoose.Schema;

const Schema = mongoose.Schema;

const eventsSchema = new Schema({
  code: {
    type: String,
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
});
const events = mongoose.model("events", eventsSchema);
module.exports = events;
