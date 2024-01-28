const { Schema, model } = require('mongoose');

const PaymentSchema = Schema({
    uid: String,
    name: String,
    amount: Number,
    bank: String,
    account: Number,
    status: { type: String, default: '0' }
}, {
    timestamps: true
})


module.exports = model('payment', PaymentSchema);