var bodyParser = require('body-parser');
var Product = require('../Models/Product.js');
var Cate = require('../Models/Cate.js');

var urlencodedParser = bodyParser.urlencoded({ extended: false });


module.exports = function(app) {
    app.get('/', function(req, res){
        Product.findById().then(function(data){
            Product.find().then(function(product){
                Cate.find().then(function(cate){
                    res.render('index',{product: product, cate: cate, data: data});
                });
            });
        }); 
    });

    app.get('/product/:name.:id.:cateName', function(req,res){
        Product.findById(req.params.id).then(function(product){
            Product.find().then(function(pro){
                Cate.find(req.params.cateName).then(function(cate){
                    res.render('product-detail',{product: product, cate: cate, pro: pro})
                });
            })
        });
    });

    app.get('/product/:cate', function(req, res){
        Product.find().then(function(product){
            Cate.findOne({name: req.params.cate}).then(function(cate){
                res.render('product',{product: product, cate: cate})
            });
        })
    })
};