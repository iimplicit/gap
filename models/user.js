/**
 * Created by syntaxfish on 15. 2. 2..
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = Schema.ObjectId;

/**
 *
 * User Schema
 *
 * @date: 15. 2. 19.
 * @time: 04:30:09
 * @author: Changwook Park ( syntaxfish@gmail.com )
 *
 * **/
module.exports = (function() {
    var User = new Schema({
        username: {type: String, unique: true, index: true },
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now},
        email: String,
        password: String,
        surveyResult: {}
    });

    return mongoose.model('User', User);
})();


