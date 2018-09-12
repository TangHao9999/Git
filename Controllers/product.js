var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Product = require('../Models/Product.js');
var Cate = require('../Models/Cate.js');
var User = require('../Models/User.js');

var urlencodedParser = bodyParser.urlencoded({
    extended: false
});



module.exports = function (app) {
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.get('/', function (req, res) {
        Product.findById().then(function (data) {
            Product.find().then(function (product) {
                Cate.find().then(function (cate) {
                    res.render('index', {
                        product: product,
                        cate: cate,
                        data: data
                    });
                });
            });
        });
    });

    app.get('/product/:name.:id.:cateName', function (req, res) {
        Product.findById(req.params.id).then(function (product) {
            Product.find().then(function (pro) {
                Cate.find({name: req.params.cateName}).then(function (cate) {
                    res.render('product-detail', {
                        product: product,
                        cate: cate,
                        pro: pro
                    })
                });
            });
        });
    });

    app.get('/product/:cate', function (req, res) {
        Product.find().then(function (product) {
            Cate.findOne({
                name: req.params.cate
            }).then(function (cate) {
                res.render('product', {
                    product: product,
                    cate: cate
                })
            });
        });
    });

    //User
    app.get('/user/signup', function (req, res) {
        res.render('users/signup');
    });
    app.post('/user/signup', urlencodedParser, function (req, res) {
        var newUser = new User({
            userName: req.body.username,
            passWord: req.body.password
        });
        newUser.save().then(function () {
            res.redirect('/user/signin');
        });
    });

    app.get('/user/signin', function (req, res) {
        res.render('users/signin');
    });
    app.post('/user/signin', passport.authenticate('local', {
        failureRedirect: '/user/signin',
        successRedirect: '/',
        failureFlash: true
    }),
        function(req, res){
            res.redirect('/');
    });
    passport.use(new LocalStrategy(function(username, password, done) {
        User.findOne({
            userName: username,
            passWord: password
        }, function (err, user) {
            if (err) {
                throw err;
            }
            if (!user) {
                return done(null, false);
            } else {
                return done(null, user);
            }
        })
    }));
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            if (err) {
                throw err;
            }
            if (!user) {
                return done(null, false);
            } else {
                return done(null, user)
            }
        });
    });

    app.get('/user/signout', function (req, res) {
        req.logout();
	    res.redirect('/');
    });

    app.get('/user/profile', checkUser, function (req, res) {
        res.send('Hello');
    });

    function checkUser(req, res, next){
        if(req.isAuthenticated()){
            return next();
        } else {
            res.redirect('/user/signin');
        }
    }
};