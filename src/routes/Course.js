const express = require('express');
const multer = require('multer');
const { addCourse, getCourseList, getCourse, getCoursesByUser } = require('../controllers/Course');
const router = express.Router();
const upload = multer();

router.post('/register', upload.array('files'), addCourse);
router.post('/retrieve', getCourseList);
router.get('/retrieve/:id', getCourse);
router.get('/retrieve/user/:userId', getCoursesByUser);


module.exports = router;