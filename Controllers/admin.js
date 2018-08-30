var bodyParser = require('body-parser');
var Product = require('../Models/Product.js');
var Cate = require('../Models/Cate.js');
var Admin = require('../Models/Admin.js');
var multer = require('multer');

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
            Cate.findById().then(function(data){
                res.render('addProduct', {
                    cate: cate
                });
            });
        });
    });
    app.post('/admin/addProduct', upload.single('img1'), urlencodedParser, function (req, res) {
        var originalFileName = req.file.originalname;
        var product = new Product({
            name: req.body.name,
            img: {img1: originalFileName},
            price: req.body.price,
            des: req.body.des,
            cateName: req.body.cateName,
            amount: req.body.amount
        });
        product.save().then(function () {
            res.redirect('/admin/listProduct');
        });
    });
};