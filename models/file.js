const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const fileSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("File", fileSchema);
