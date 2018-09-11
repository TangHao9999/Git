var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');


var product = require('./Controllers/product.js');
var admin = require('./Controllers/admin.js');

var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieParser());

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

//set up template engine;
app.set('view engine', 'ejs');
app.set('views', './Views/page');

//static files
app.use(express.static('./Public'));

// Express Validator
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//Controllers
product(app);
admin(app);

//Listen to port
app.listen(3000, function () {
    console.log('You are listenning to port 3000');
});