const { Schema, model } = require('mongoose');

const CodeSchema = Schema({
    description: String,
    products: [String],
    valid: { type: Boolean, default: true }
}, {
    timestamps: true
})

module.exports = model('code', CodeSchema);