const express = require('express')
const routes = require('./routes')
const flash = require('connect-flash')
var session = require('express-session');
const mongoose = require('mongoose')

//db connection
mongoose.set('strictQuery', true)
mongoose.connect('mongodb://localhost:27017/urls', 
    {    useNewUrlParser: true, 
        useUnifiedTopology: true,
        family: 4,},
    (err)=>{
        if(!err) console.log('connected to DB')
        else console.log(err)
    })
 
const port=process.env.PORT ||5000
require('dotenv').config();
const app = express();
app.use(express.urlencoded({extended:false}))
app.use(session({
    secret: 'keyboard cat',
    cookie: { maxAge: 60000 },
    resave:false,
    saveUninitialized:false
  }));
app.use(flash());


app.set('view engine', 'ejs')
app.use('/', routes)
app.listen(port, console.log(`server running on http://localhost:${port}/`))
