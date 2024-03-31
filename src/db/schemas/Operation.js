const { Schema, model } = require('mongoose');

const OperationSchema = Schema({
    uid: String,
    products: [
        {
            code: String,
            title: String,
            course: String,
            price: Number,
            zip: String,
            materials: [
                {
                    code: String,
                    title: String,
                    zip: String
                }
            ]
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