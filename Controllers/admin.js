var bodyParser = require('body-parser');
var Product = require('../Models/Product.js');
var Cate = require('../Models/Cate.js');
var Admin = require('../Models/Admin.js');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local');

var urlencodedParser = bodyParser.urlencoded({
    extended: false
});
//Upload--image
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //cb(null, 'uploads/')
        cb(null, './Public/assets/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({
    storage: storage
});


module.exports = function (app) {
    app.get('/admin', function (req, res) {
            res.render('loginAdmin');
    });
    app.post('/admin', urlencodedParser, function (req, res) {
        var name = req.body.name;
        var passWord = req.body.passWord;
        Admin.findOne({
            name: name,
            passWord: passWord
        }, function (err, data) {
            if (err) {
                throw err;
            }
            if (!data) {
                res.redirect('/admin');
            } else {
                //res.redirect('/dashboardAdmin');
                res.render('dashboardAdmin');
            }
        })
    });
    app.get('/admin/logout', function(req, res){
        req.logout();
        req.flash('success_msg', 'You are logged out');
        res.redirect('/admin')
    })

    // Category ===============================================================================
    app.get('/admin/listCategory', function (req, res) {
        Cate.find().then(function (cate) {
            res.render('listCategory', {
                cate: cate
            });
        })
    });
    app.get('/admin/addCategory', function (req, res) {
        res.render('addCategory');
    });
    app.post('/admin/addCategory', urlencodedParser, function (req, res) {
        var cate = new Cate({
            name: req.body.name
        });

        cate.save().then(function () {
            res.redirect('/admin/listCategory');
        });
    });
    app.get('/admin/listCategory/:id', function (req, res) {
        Cate.findById(req.params.id, function (cate) {
            var query = {
                _id: req.params.id
            };
            Cate.remove(query, function (err) {
                if (err) {
                    console.log(err);
                }

                res.redirect('/admin/listCategory');
            });
        });
    });
    app.get('/admin/editCategory/:id', function (req, res) {
        Cate.findById(req.params.id).then(function (cate) {
            res.render('editCategory', {
                cate: cate
            });
        });
    });
    app.post('/admin/editCategory/:id', urlencodedParser, function (req, res) {
        Cate.findById(req.params.id).then(function (cate) {
            cate.name = req.body.name;
            cate.save().then(function () {
                res.redirect('/admin/listCategory');
            });
        });
    });

    // Product =========================================================================
    app.get('/admin/listProduct', function (req, res) {
        Product.find().then(function (product) {
            Cate.find().then(function (cate) {
                res.render('listProduct', {
                    product: product,
                    cate: cate
                });
            })
        })
    });
    app.get('/admin/addProduct', function (req, res) {
        Cate.find().then(function (cate) {
            Cate.findById().then(function (data) {
                res.render('addProduct', {
                    cate: cate
                });
            });
        });
    });
    app.post('/admin/addProduct', upload.any(), urlencodedParser, function (req, res) {
        var originalFileName1 = req.files[0].originalname;
        var originalFileName2 = req.files[1].originalname;
        var originalFileName3 = req.files[2].originalname;
        var product = new Product({
            name: req.body.name,
            img: {
                img1: originalFileName1,
                img2: originalFileName2,
                img3: originalFileName3
            },
            price: req.body.price,
            des: req.body.des,
            cateName: req.body.cateName,
            amount: req.body.amount
        });
        product.save().then(function () {
            res.redirect('/admin/listProduct');
        });
    });
    app.get('/admin/listProduct/:id', function (req, res) {
        Product.findById(req.params.id, function (product) {
            var query = {
                _id: req.params.id
            };
            Product.remove(query, function (err) {
                if (err) {
                    console.log(err);
                }

                res.redirect('/admin/listProduct');
            });
        });
    });
    app.get('/admin/editProduct/:id', function (req, res) {
        Product.findById(req.params.id).then(function (product) {
            Cate.find().then(function (cate) {
                res.render('editProduct', {
                    product: product,
                    cate: cate
                });
            });
        });
    });
    app.post('/admin/editProduct/:id', upload.any(), urlencodedParser, function (req, res) {
        var originalFileName1 = req.files[0].originalname;
        var originalFileName2 = req.files[1].originalname;
        var originalFileName3 = req.files[2].originalname;
        Product.findById(req.params.id).then(function (product) {
            // product.name = req.body.name,
            // product.img.img1 = originalFileName1,
            // product.img.img2 = originalFileName2,
            // product.img.img3 = originalFileName3,
            // product.price = req.body.price,
            // product.des = req.body.des,
            // product.cateName = req.body.cateName,
            // product.amount = req.body.amount
            // product.save().then(function () {
            //     res.redirect('/admin/listProduct');
            // });
            // console.log(product.img);
            Product.update({_id: product._id}, {
                name: req.body.name,
                img: {
                    img1: originalFileName1,
                    img2: originalFileName2,
                    img3: originalFileName3
                },
                price: req.body.price,
                des: req.body.des,
                cateName: req.body.cateName,
                amount: req.body.amount
            }).then(function (){
                res.redirect('/admin/listProduct',);
            });
        });
    });

    function checkAdmin(req, res, next){
        if(req.isAuthenticated()){
            next();
        }
            res.redirect('/admin');
    }
};