var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/DoAn2018');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Connectd to MongoDB (Order)');
});

var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var Order = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    cart: { type: Object, required: true },
    address: String,
    name: String,
    paymentID: String
  }, {collection : 'Order', versionKey: false});

  module.exports = mongoose.model('Order', Order);