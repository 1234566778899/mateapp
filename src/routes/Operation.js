const express = require('express');
const { registerOperation, getOperationsByUser, getEarningsByUser } = require('../controllers/Operation');
const router = express.Router();

router.post('/register', registerOperation);
router.get('/retrieve/user/:userId', getOperationsByUser);
router.get('/retrieve/earnings/:userId', getEarningsByUser);

module.exports = router;