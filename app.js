const express = require('express');
const mongoose = require('mongoose');
//session store in browser
const session = require('express-session');
//MongoDB URI
const MONGODB_URI = 'mongodb://localhost:27017/binar_crudv2'
//save session to mongodb
const MongoDBStore = require('connect-mongodb-session')(session);
//library security for csrf attack
const csrf = require('csurf');
//library for flash messages
const flash = require('connect-flash');
//import user model
const User = require('./models/UserCredSchema');
//import routes
const loginRoutes = require('./routes/login')

const app = express();
const csrfProtection = csrf();
//set store session to mongodb
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
})
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'));
//middleware session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: store
}))
//middleware csrf
app.use(csrfProtection)
//middleware flash message
app.use(flash())
//middleware check user
app.use((req, res, next) => {
    if (!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            res.locals.user = user;
            next();
        })
        .catch(err => console.log(err));
})
//middleware for csrf token and login authentication
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use(loginRoutes)

mongoose
    .connect(MONGODB_URI, {
        useUnifiedTopology: true, 
        useNewUrlParser: true, 
        useFindAndModify: false, 
        useCreateIndex: true
    })
    .then(() => {
        app.listen(3000)
        console.log("RUNNING")
    })
    .catch(err => {
        console.log(err)
    })