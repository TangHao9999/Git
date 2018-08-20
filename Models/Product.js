var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/DoAn2018');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Connectd to MongoDB');
});

var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var Product = new Schema({
    name :  String,
    img : { type : Object , "default" : {
        img1 : String,
        img2 : String,
        img3 : String,
         } },
    // img :  { type : Array , "default" : [] },
    price : String,
    des : String,
    cateID : String,
    amount: Number
  },{collection : 'Product'});

  module.exports = mongoose.model('Product', Product);