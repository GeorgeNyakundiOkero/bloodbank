const mongoose = require('mongoose');
const searchSchema = mongoose.Schema({
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
    requestID: {
        type: String,
        required: true
    },
    received: {
        type: Boolean,
        default: false
    }
});

const Search = mongoose.model('Search', searchSchema);
module.exports = Search;