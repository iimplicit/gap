/**
 * Created by syntaxfish on 15. 2. 2..
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = Schema.ObjectId;

/**
 *
 * SurveyResult schema
 *
 * @date: 15. 2. 19.
 * @time: 04:30:20
 * @author: Changwook Park ( syntaxfish@gmail.com )
 *
 * **/
module.exports = (function() {
    var SurveyResult = new Schema({
        userId: ObjectId,
        surveyId: {type: ObjectId, unique: true, index: true },

        result: {},

        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now}
    });

    return mongoose.model('SurveyResult', SurveyResult);
})();
