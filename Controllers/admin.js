var bodyParser = require('body-parser');
var Product = require('../Models/Product.js');
var Cate = require('../Models/Cate.js');
var Admin = require('../Models/Admin.js');

var urlencodedParser = bodyParser.urlencoded({ extended: false });


module.exports = function(app) {
    app.get('/admin', function(req, res){
        res.render('loginAdmin');
    });
    app.post('/admin', urlencodedParser, function(req, res){
        var name = req.body.name;
        var passWord = req.body.passWord;
        Admin.findOne({name: name, passWord: passWord}, function(err, data){
            if (err) {
                throw err;
            } if(!data){
                res.redirect('/admin');
            } else {
                //res.redirect('/dashboardAdmin');
                res.render('dashboardAdmin');
            }
        })
    });

    // Category ===============================================================================
    app.get('/admin/listCategory', function(req, res){
        Cate.find().then(function(cate){
            res.render('listCategory', {cate: cate});
        })
    });
    app.get('/admin/addCategory', function(req, res){
        res.render('addCategory');
    });
    app.post('/admin/addCategory', urlencodedParser, function(req, res){
        var cate = new Cate({
            name: req.body.name
        });

        cate.save().then(function(){
            res.redirect('/admin/listCategory');
        });
    });
    app.get('/admin/listCategory/:id', function(req, res){
        Cate.findById(req.params.id, function(cate){
            var query = {_id: req.params.id};
            Cate.remove(query, function(err){
                if (err){
                    console.log(err);
                }
                
                res.redirect('/admin/listCategory');
            });
        });
    });
    app.get('/admin/editCategory/:id', function(req, res){
        Cate.findById(req.params.id).then(function(cate){
            res.render('editCategory', {cate: cate});
        });
    });
    app.post('/admin/editCategory/:id', urlencodedParser, function(req, res){
        Cate.findById(req.params.id).then(function(cate){
            cate.name = req.body.name;
            cate.save().then(function(){
                res.redirect('/admin/listCategory');
            });
        });
    });

    // Product =========================================================================
    

};