const mongoose = require('mongoose');
const { Schema } = mongoose;

const Bookings = new Schema({
    hotelId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hotels'
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    name:{
        type: String,
        required: true
    },
    action:{
        type:String
    },
    from: {
        type: Date
    },
    to: {
        type: Date
    },
    time:{
        type: Date,
        default: Date.now
    }
  });
  module.exports = mongoose.model('bookings', Bookings);