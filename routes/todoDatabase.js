const mongoose = require("mongoose");

var conn = mongoose.Collection;

//const Schema = mongoose.Schema;

const Schema = mongoose.Schema;

const todoSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
});
const todo = mongoose.model("todo", todoSchema);
module.exports = todo;
