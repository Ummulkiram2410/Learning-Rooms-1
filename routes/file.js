const express = require('express');

const router = express.Router();

const fileController = require('../controllers/file');

router.get('/file', fileController.getFile);

router.post('/file', fileController.postFile);

module.exports = router;