require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const methodOverride = require('method-override')
// const session = require('express-session')
// const MemoryStore = require('memorystore')(session);
const session = require('express-session');
const cookieSession = require('cookie-session');

// const sessionStore = new MemoryStore({
//   checkPeriod: 86400000, // Clear expired sessions every 24 hours
// });

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static('public'))
app.use(methodOverride("_method"))
app.use('/node_modules', express.static('node_modules'));
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'your_secret_key_here',
//   resave: false,
//   saveUninitialized: true,
//   store: sessionStore,
// }));

app.use(
  cookieSession({
    name: 'session',
    secret: 'your_secret_key',
    // Other configuration options
  })
);

app.get('/check', (req, res, next) => {
    res.json({ msg: "Health Check" })
})

app.use('/twitter', require('./routes/twitter.route'))

app.listen(process.env.PORT)


// entry ---> route ----> controller ----> model