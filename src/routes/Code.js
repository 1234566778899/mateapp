const express = require('express');
const { registerCode } = require('../controllers/Code');
const router = express.Router();

router.post('/register', registerCode);

module.exports = router;