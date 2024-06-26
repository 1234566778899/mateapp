const { Schema, model } = require('mongoose');

const CourseSchema = Schema({
    title: String,
    description: String,
    tools: [String],
    videoUrl: String,
    price: Number,
    preview: String,
    university: String,
    screens: [
        String
    ],
    status: { type: String, default: '0' },
    author: String,
    user: String,
    category: { type: String, default: 'none' }
}, {
    timestamps: true
})

module.exports = model('course', CourseSchema);