const mongoose = require('mongoose')
const otpSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sms: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date
    }

})

module.exports = mongoose.model('OtpModel', otpSchema)