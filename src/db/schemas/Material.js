const { Schema, model } = require('mongoose');

const MaterialSchema = Schema({
    title: String,
    description: String,
    course: {
        type: Schema.Types.ObjectId,
        ref: 'course'
    },
    lastUpdate: Date,
    price: Number,
    url: String,
    quantitySold: { type: Number, default: 0 },
}, {
    timestamps: true
})

module.exports = model('material', MaterialSchema);