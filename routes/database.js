const mongoose = require("mongoose");

var conn = mongoose.Collection;

//const Schema = mongoose.Schema;

const Schema = mongoose.Schema;

const signupSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
  username: {
    type: String,
    required: true,
  },
});
const Login = mongoose.model("Login", signupSchema);
module.exports = Login;
