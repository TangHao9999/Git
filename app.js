var express = require('express');
var product = require('./Controllers/product.js');
var admin = require('./Controllers/admin.js');

var app = express();

//set up template engine;
app.set('view engine', 'ejs');
app.set('views','./Views/page');

//static files
app.use(express.static('./Public'));

//Controllers
product(app);
admin(app);

//Listen to port
app.listen(3000, function(){
    console.log('You are listenning to port 3000');
});