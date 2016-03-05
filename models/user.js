var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    account_id: Account.id,
    name: String,
    address: String,
    payment: String
});

module.exports = mongoose.model('User', user);
 
