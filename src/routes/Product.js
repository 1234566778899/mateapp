const express = require('express');
const { addProducto, getProductList, getProduct, getProductsByUser } = require('../controllers/Product');
const multer = require('multer');
const router = express.Router();
const upload = multer();

router.post('/register', upload.array('files'), addProducto);
router.post('/retrieve', getProductList);
router.get('/retrieve/:id', getProduct);
router.get('/retrieve/user/:userId', getProductsByUser);

module.exports = router;