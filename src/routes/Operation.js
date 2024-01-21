const express = require('express');
const { registerOperation, getOperationsByUser } = require('../controllers/Operation');
const router = express.Router();

router.post('/register', registerOperation);
router.get('/retrieve/user/:userId', getOperationsByUser);

module.exports = router;