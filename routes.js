const express = require('express');
const twilio = require('twilio')
const router = express.Router();

const list = require('./contactDetails.json')
const OtpModel = require('./Models/otpModel')

//menu options screen
router.get('/', async (req, res) => {
    res.render('index')
})

//contact list screen
router.get('/contacts', (req, res) => {
    res.render('list', { list })
})

//contact details screen
router.get('/contacts/:firstName', (req, res) => {
    const details = list.find(ele =>
        req.params.firstName == ele.firstName)
    res.render('contactDetails', { details})
})

// draft message screen
router.get('/contacts/sendmessage/:firstName', (req, res) => {
    const details = list.find(ele =>
        req.params.firstName == ele.firstName)
    const otp = Math.round(Math.random() * 900000 + 100000)
    const message = `Hi. Your OTP is: ${otp}`
    res.render('sendMessage', { details, message, flashMessage: req.flash('flashMessage') })
})

//perform otp sent and storeing it in db
router.post('/contacts/sendmessage', async (req, res) => {
    try {
        const details = list.find(ele => req.body.firstName == ele.firstName)
        let accountSid = process.env.TWILIO_ACCOUNT_SID;
        let authToken = process.env.TWILIO_AUTH_TOKEN;
        const client = new twilio(accountSid, authToken);
        const response = await client.messages.create({ body: req.body.message, from: process.env.PHONE_NUMBER, to: "+91"+details.phoneNumber })
        const result = await OtpModel.create({ name: req.body.firstName, sms: req.body.message })
        req.flash('flashMessage', 'OTP sent successfull')
        res.redirect('/contacts/sendmessage/' + details.firstName)
    } catch (error) {
        req.flash('flashMessage', 'OTP sent failure')
        res.redirect('/contacts/sendmessage/' + details.firstName)
    }
});

//sent messages
router.get('/messages', async (req, res) => {
    const messageList = await OtpModel.find().sort({ createdAt: -1 })
    res.render('messages', { messageList })
})

module.exports = router