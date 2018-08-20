var bodyParser = require('body-parser');
var Product = require('../Models/Product.js');
var Cate = require('../Models/Cate.js');

var urlencodedParser = bodyParser.urlencoded({ extended: false });


module.exports = function(app) {
    app.get('/', function(req, res){
        Product.findById(req.params.id).then(function(data){
            Product.find().then(function(product){
                Cate.find().then(function(cate){
                    res.render('index',{product: product, cate: cate});
                });
            });
        }); 
    });

    app.get('/product/:name.:id.:cateID', function(req,res){
        Product.findById(req.params.id).then(function(product){
            Product.find().then(function(pro){
                Cate.findById(req.params.cateID).then(function(cate){
                    res.render('product-detail',{product: product, cate: cate, pro: pro})
                });
            })
        });
    });
};