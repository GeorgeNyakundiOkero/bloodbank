const mongoose = require('mongoose');
const infoSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true,
        unique: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    bloodGroup: {
        type: String,
        required: true
    },
    rh: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    dateUpdated: {
        type: Date,
        default: Date.now
    }, 
    isAvailable: {
        type: Boolean,
        default: true
    }
});

const Userinfo = mongoose.model('Userinfo', infoSchema);
module.exports = Userinfo;