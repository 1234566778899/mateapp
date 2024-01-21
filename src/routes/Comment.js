const express = require('express');
const { addComment, getCommentsByProduct } = require('../controllers/Comment');
const router = express.Router();

router.post('/register', addComment);
router.get('/retrieve/:productId', getCommentsByProduct);


module.exports = router;