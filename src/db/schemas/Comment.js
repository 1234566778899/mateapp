const { Schema, model } = require('mongoose');

const CommentSchema = Schema({
    description: String,
    uid: String,
    author: String,
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }
}, {
    timestamps: true
})

module.exports = model('comment', CommentSchema);