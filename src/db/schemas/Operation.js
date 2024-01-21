const { Schema, model } = require('mongoose');

const OperationSchema = Schema({
    uid: String,
    products: [
        {
            code: String,
            title: String,
            price: Number,
            zip: String
        }
    ],
    total: Number,
    typePay: String,
    name: String,
    code: String
}, {
    timestamps: true
})

module.exports = model('operation', OperationSchema);