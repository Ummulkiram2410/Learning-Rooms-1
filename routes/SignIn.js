const express = require("express");
const { check, body } = require("express-validator/check");

const router = express.Router();

const Login = require("../models/database");

const signIncontroller = require("../controllers/SignIn.js");

router.get("/main-page", signIncontroller.mainPage);

router.get("/login", signIncontroller.logIn);

router.get("/signup", signIncontroller.signUp);

router.post("/login", signIncontroller.postlogIn);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        // if (value === 'test@test.com') {
        //   throw new Error('This email address if forbidden.');
        // }
        // return true;
        return Login.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-Mail exists already, please pick a different one."
            );
          }
        });
      }),
    body(
      "password",
      "Please enter a password with at least 5 characters."
    ).isLength({ min: 5 }),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match!");
      }
      return true;
    }),
    body("username", "Please enter a valid username with only numbers and text")
      .isLength({ min: 1 })
      .isAlphanumeric(),
  ],
  signIncontroller.postsignUp
);

router.get("/logout", signIncontroller.postLogout);

router.get("/reset", signIncontroller.getReset);

router.post("/reset", signIncontroller.postReset);

router.get("/reset/:token", signIncontroller.getNewPassword);

router.post("/new-password", signIncontroller.postNewPassword);

module.exports = router;
