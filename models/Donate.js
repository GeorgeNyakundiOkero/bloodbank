const mongoose = require('mongoose');
const donateSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    bloodGroup: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    donationID: {
        type: String,
        required: true
    },
    donated: {
        type: Boolean,
        default: false
    }
});

const Donate = mongoose.model('Donate', donateSchema);
module.exports = Donate;