const mongoose = require("mongoose");

const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

//const sendgridTransport = require("nodemailer-sender-transport");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "u18co111@coed.svnit.ac.in",
    pass: "",
  },
});

const { validationResult } = require("express-validator/check");

const session = require("express-session");
const Login = require("../models/database");

exports.logIn = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("login2", {
    errorMessage: message,
  });
};

exports.signUp = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("signup2", {
    errorMessage: message,
  });
};

exports.postlogIn = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  /*const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("login2");
  }*/

  Login.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            //console.log(req.session.user);
            //console.log(req.session.user.username);
            return req.session.save((err) => {
              //console.log(err);
              if (err) {
                req.flash("error", "Invalid email or password.");
                return res.redirect("/login");
              }
              res.redirect("/channels");
            });
          }
          req.flash("error", "Invalid email or password.");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postsignUp = (req, res, next) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("signup2", {
      errorMessage: errors.array()[0].msg,
    });
  }
  Login.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new Login({
            email: email,
            password: hashedPassword,
            username: username,
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/login");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("reset", {
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    Login.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/main-page");
        transporter.sendMail({
          to: req.body.email,
          from: "u18co111@coed.svnit.ac.in",
          subject: "Password reset",
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          `,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  Login.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("resetp", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: message,
        email: user.email,
        passwordToken: token,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const email = req.body.email;
  console.log(email);
  const passwordToken = req.body.passwordToken;
  let resetUser;
  console.log(newPassword);
  Login.findOne({
    resetToken: passwordToken,
    email: email,
  })
    .then((user) => {
      resetUser = user;
      console.log(user);
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.mainPage = (req, res, next) => {
  res.render("index");
};

exports.deleteAccount = (req, res, next) => {
  const email = req.session.user.email;
  Login.deleteOne({ email: email }, function (err, obj) {
    if (err) throw err;
  });
  res.redirect("/main-page");
};
