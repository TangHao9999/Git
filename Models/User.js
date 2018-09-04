var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/DoAn2018');
var bcrypt = require('bcrypt-nodejs');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log('Connectd to MongoDB (User)');
});

var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var User = new Schema({
  useName: String,
  passWord: String
}, {
  collection: 'User'
});

User.methods.encryptPassword = function (passWord) {
  return bcrypt.hashSync(passWord, bcrypt.genSaltSync(5), null);
};

User.methods.validPassword = function (passWord) {
  return bcrypt.compareSync(passWord, this.passWord);
};

module.exports = mongoose.model('User', User);