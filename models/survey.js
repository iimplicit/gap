/**
 * Created by syntaxfish on 15. 2. 2..
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = Schema.ObjectId;

/**
 *
 * Survey Schema
 *
 * @date: 15. 2. 19.
 * @time: 04:30:41
 * @author: Changwook Park ( syntaxfish@gmail.com )
 *
 * **/
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
        items: {},
        url: String,
        responseCount: {type: Number, default: 0},
        analyticsData: {},
        surveyResult : {}
    });

    return mongoose.model('Survey', Survey);
})();
