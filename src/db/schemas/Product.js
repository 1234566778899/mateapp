const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
    title: String,
    description: String,
    course: String,
    tools: [String],
    lastUpdate: Date,
    videoUrl: String,
    price: Number,
    preview: String,
    zip: String,
    miniature: String,
    files: [String],
    quantitySold: { type: Number, default: 0 },
    status: { type: String, default: '0' },
    author: String,
    uid: String
}, {
    timestamps: true
})

module.exports = model('product', ProductSchema);