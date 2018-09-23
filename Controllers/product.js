var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var Product = require('../Models/Product.js');
var Cate = require('../Models/Cate.js');
var User = require('../Models/User.js');
var Cart = require('../Models/Cart.js');
var Order = require('../Models/Order.js');

var urlencodedParser = bodyParser.urlencoded({
    extended: false
});


module.exports = function (app) {
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.get('/', function (req, res) {
        var successMsg = req.flash('success')[0];
        Product.findById().then(function (data) {
            Product.find().then(function (product) {
                Cate.find().then(function (cate) {
                    res.render('index', {
                        product: product,
                        cate: cate,
                        data: data,
                        successMsg: successMsg,
                        noMessage: !successMsg
                    });
                });
            });
        });
    });

    app.get('/product/:name.:id.:cateName', function (req, res) {
        Product.findById(req.params.id).then(function (product) {
            Product.find().then(function (pro) {
                Cate.findOne({
                    name: req.params.cateName
                }).then(function (cate) {
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
            res.redirect(req.session.oldUrl);
        });
    });

    app.get('/user/signin', function (req, res) {
        res.render('users/signin');
    });
    app.post('/user/signin', passport.authenticate('local', {
            failureRedirect: '/user/signin',
            failureFlash: true
        }),
        function (req, res) {
            if (req.session.oldUrl) {
                var oldUrl = req.session.oldUrl;
                req.session.oldUrl = null;
                res.redirect(oldUrl);
            } else {
                res.redirect('/');
            }
        });
    passport.use(new LocalStrategy(function (username, password, done) {
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
        Order.find({user: req.user}, function(err, orders){
            if(err){
                return res.write('Errorr!');
            }
            var cart;
            orders.forEach(function(order){
                cart = new Cart(order.cart);
                order.items = cart.generateArray();
            });
            res.render('profile', {orders: orders});
        });
    });

    function checkUser(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            req.session.oldUrl = req.url;
            res.redirect('/user/signin');
        }
    }

    // Shop-Cart
    app.get('/add-to-cart/:id', function (req, res) {
        var productID = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});
        Product.findById(productID, function (err, data) {
            if (err) {
                return res.redirect('/');
            }
            cart.add(data, data.id);
            req.session.cart = cart;
            console.log(req.session.cart);
            res.redirect('/');
        })
    });
    app.get('/shoping-cart', function (req, res) {
        var cart = new Cart(req.session.cart);
        if (!req.session.cart) {
            return res.render('cart', {
                products: null
            });
        }
        res.render('cart', {
            products: cart.generateArray(),
            totalAmount: cart.totalAmount,
            totalPrice: cart.totalPrice
        })
    });
    app.get('/reducebyone/:id', function (req, res) {
        var productID = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});

        cart.reduceByOne(productID);
        req.session.cart = cart;
        res.redirect('/shoping-cart');
    });
    app.get('/remove/:id', function (req, res) {
        var productID = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});

        cart.removeItem(productID);
        req.session.cart = cart;
        res.redirect('/shoping-cart');
    });
    app.get('/checkout', checkUser, function (req, res) {
        if (!req.session.cart) {
            return res.redirect('/shoping-cart');
        } else if (req.session.cart == null) {
            return res.redirect('/shoping-cart');
        }
        var cart = new Cart(req.session.cart);
        var errMsg = req.flash('error')[0];
        res.render('checkout', {
            totalPrice: cart.totalPrice, 
            errMsg: errMsg,
            noError: !errMsg,
        });
    });
    app.post('/checkout', checkUser, function (req, res) {
        if (!req.session.cart) {
            return res.redirect('/shoping-cart');
        }
        var cart = new Cart(req.session.cart);
        var stripe = require("stripe")("sk_test_JTgxORdqDWfX6Cy9mIHikN7f");

        stripe.charges.create({
            amount: cart.totalPrice * 100,
            currency: "usd",
            source: req.body.stripeToken, // obtained with Stripe.js
            description: "Test Charge"
        }, function (err, charge) {
            if(err){
                req.flash('error', err.message);
                return res.redirect('/checkout');
            }
            var order = new Order({
                user: req.user,
                cart: cart,
                address: req.body.address,
                name: req.body.name,
                paymentID: charge.id
            });
            order.save().then(function(err, rs){
                req.flash('success', 'Successfully bought Product !');
                req.session.cart = null;
                res.redirect('/');
            })
        });
    });
};