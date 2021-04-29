const express = require("express");

const { check, body } = require("express-validator/check");

const router = express.Router();

const channels = require("../models/channelDatabase");

const todo = require("../models/todoDatabase");

const channelController = require("../controllers/channels.js");

router.get("/channels", channelController.getChannels);

router.get("/to-do", channelController.todo);

router.post("/to-do", channelController.posttodo);

router.get("/remove/:id", channelController.delete);

router.post("/createChannel", channelController.createChannel);

router.post(
  "/joinChannel",
  [body("code", "Please Enter a code").isLength({ min: 1 })],
  channelController.joinChannel
);

router.get("/channel", channelController.getChannel);
module.exports = router;
