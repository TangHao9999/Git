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

var Admin = new Schema({
    name :  String,
    passWord: String
  },{collection : 'Admin'});

  module.exports = mongoose.model('Admin', Admin);