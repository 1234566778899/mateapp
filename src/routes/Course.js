const express = require('express');
const multer = require('multer');
const { addCourse, getCourseList, getCourse, getCoursesByUser, updateStatus, getAllCourses } = require('../controllers/Course');
const router = express.Router();
const upload = multer();

router.post('/register', upload.array('files'), addCourse);
router.post('/retrieve', getCourseList);
router.get('/retrieve', getAllCourses);
router.get('/retrieve/:id', getCourse);
router.get('/retrieve/user/:userId', getCoursesByUser);
router.put('/update/:id', updateStatus);


module.exports = router;