var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var Product = require('../Models/Product.js');
var Cate = require('../Models/Cate.js');
var User = require('../Models/User.js');
var Cart = require('../Models/Cart.js');

var paypal = require('paypal-rest-sdk');



var urlencodedParser = bodyParser.urlencoded({
    extended: false
});


paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AdQZ8K7LkIaHaIEVahV0w0SZ9cODU72fVplzKq2gjBCBD2G0SOcnbJDEKsB5L4T0fbdwHtjx-IRZdU_T',
    'client_secret': 'EFEpg6pWZZ6cl9VOrjKs1qjG7kUliF6mJSKfEVoy7xkjcHwf3rQvdY38l2j7X5ang83UIfnzWZ_Zfhyh'
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
            if (req.session.oldUrl){
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
        res.send('Hello');
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
    app.get('/reducebyone/:id', function(req,res){
        var productID = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});

        cart.reduceByOne(productID);
        req.session.cart = cart;
        res.redirect('/shoping-cart');
    });
    app.get('/remove/:id', function(req,res){
        var productID = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});

        cart.removeItem(productID);
        req.session.cart = cart;
        res.redirect('/shoping-cart');
    });
    app.get('/checkout', checkUser, function (req, res) {
        if (!req.session.cart) {
            return res.redirect('/shoping-cart');
        }
        var cart = new Cart(req.session.cart);
        res.render('checkout', {
            totalPrice: cart.totalPrice
        });
    });

    app.post('/checkout', function (req, res) {
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:3000/success",
                "cancel_url": "http://localhost:3000/cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "Red hat",
                        "sku": "001",
                        "price": "25.00",
                        "currency": "USD",
                        "amount": "1"
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": "25.00"
                },
                "description": "This is the payment description."
            }]
        };
        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                console.log(error);
                throw error;
            } else {
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === 'approval_url') {
                        res.redirect(payment.links[i].href);
                    }
                }

            }
        });
    });

    // app.get('/success', (req, res) => {
    //     const payerId = req.query.PayerID;
    //     const paymentId = req.query.paymentId;

    //     const execute_payment_json = {
    //         "payer_id": payerId,
    //         "transactions": [{
    //             "amount": {
    //                 "currency": "USD",
    //                 "total": "25.00"
    //             }
    //         }]
    //     };

    //     paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    //         if (error) {
    //             console.log(error.response);
    //             throw error;
    //         } else {
    //             console.log(JSON.stringify(payment));
    //             res.send('Success');
    //         }
    //     });
    // });
    // app.get('/cancel', (req, res) => res.send('Cancelled'));
};