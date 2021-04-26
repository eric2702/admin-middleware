const mongoose = require('mongoose');

const UserCredSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    }
})

const UserCred = mongoose.model('Credential', UserCredSchema);

module.exports = UserCred;
