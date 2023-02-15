const express = require('express')
const flash = require('connect-flash')
var session = require('express-session');
const mongoose = require('mongoose')

const OtpModel = require('./Models/otpModel')
const ContactsRouter = require('./routes')
require('dotenv').config();

const port = process.env.PORT || 5000
const app = express();
app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret: 'keyboard cat',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

mongoose.set('strictQuery', true)
mongoose.connect('mongodb://localhost:27017/urls',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  },
  (err) => {
    if (!err) console.log('connected to DB')
    else console.log(err)
  })

app.set('view engine', 'ejs')

app.use('/contacts', ContactsRouter)

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/messages', async (req, res) => {
  const messageList = await OtpModel.find().sort({ createdAt: -1 })
  res.render('messages', { messageList })
})


app.listen(port,console.log(`server running on http://localhost:${port}/`))
