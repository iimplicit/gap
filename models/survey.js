/**
 * Created by syntaxfish on 15. 2. 2..
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = Schema.ObjectId;

module.exports = (function() {
    var Survey = new Schema({
        userId: ObjectId,
        title: String,
        description: String,
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now},
        type: Number,
        formSetting: {},
        indexSetting: {},
        items: [{}],
        url: String,
        responseCount: Number,
        analyticsData: {}
    });

    return mongoose.model('Survey', Survey);
})();
