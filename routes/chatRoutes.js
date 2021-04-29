const express = require("express");

const router = express.Router();

const chatRoutes = require('../controllers/Chat');


router.use("/channel", (req, res) => {
    res.render('insideChannel');
})

router.get("/messages", chatRoutes.getMessage);

router.post("/messages", chatRoutes.postMessage);

module.exports = router;