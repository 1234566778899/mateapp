const express = require('express');
const { registerOperation } = require('../controllers/Operation');
const router = express.Router();

router.post('/register', registerOperation);

module.exports = router;