var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/DoAn2018');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Connectd to MongoDB (Category)');
});

var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var Cate = new Schema({
    name :  String,
  }, {collection : 'Cate', versionKey: false});

  module.exports = mongoose.model('Cate', Cate);