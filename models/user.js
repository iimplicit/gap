/**
 * Created by syntaxfish on 15. 2. 2..
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = Schema.ObjectId;

module.exports = (function() {
    var User = new Schema({
        username: {type: String, unique: true, index: true },
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now},
        email: String,
        password: String
    });

    return mongoose.model('User', User);
})();


