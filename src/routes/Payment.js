const express = require('express');
const { sendPayment, getPayments } = require('../controllers/Payment');
const router = express.Router();

router.post('/register', sendPayment);
router.get('/retrieve/:id', getPayments);


module.exports = router;