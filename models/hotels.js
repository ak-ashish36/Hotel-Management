const mongoose = require('mongoose');
const { Schema } = mongoose;

const HotelsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    about: {
        type: String
    },
    address: {
        type: String
    },
    imgUri: {
        type: String
    },
    price: {
        type: Number
    },
    booked: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    startingDate: {
        type: Date
    },
    endingDate: {
        type: Date
    }
});

module.exports = mongoose.model('hotels', HotelsSchema);