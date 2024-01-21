const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    name: String,
    lastName: String,
    username: String,
    email: String,
    uid: String
}, {
    timestamps: true
})

module.exports = model('user', UserSchema);