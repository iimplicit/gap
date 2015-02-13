/**
 * Created by syntaxfish on 15. 2. 9..
 */
var _ = require('underscore');
var json2csv = require('json2csv');

var arr = [
    {
        title: "survey 1",
        description: "description 1",
        items: [
            {
                name: "11",
                scenario: "secnario11"
            },
            {
                name: "12",
                scenario: "secnario12"
            }
        ],
        object: { test: 'set'}
    },
    {
        title: "survey 2",
        description: "description 2",
        items: [
            {
                name: "21",
                scenario: "secnario21"
            },
            {
                name: "22",
                scenario: "secnario22"
            }
        ],
        object: { test: 'set'}
    },
    {
        title: "survey 3",
        description: "description 3",
        items: [
            {
                name: "31",
                scenario: "secnario31"
            },
            {
                name: "32",
                scenario: "secnario32"
            }
        ],
        object: { test: 'set'}
    }
];

function exportCsv(surveys, fields, callback) {
    var values = [];

    surveys.forEach(function(survey) {
        Array.prototype.push.apply(values, _exportJsonArray(survey));
    });

    return json2csv({data: values, fields: fields}, callback);
};

function _exportJsonArray(object) {
    var jsonList = [{}];
    var keys = _.keys(object);

    keys.forEach(function(key) {
        if(_.isArray(object[key])) {
            var arr = object[key];
            var tempJsonList = [];

            arr.forEach(function(innerObject) {

                if(_.isObject(innerObject)) {
                    jsonList.forEach(function(origin) {
                        tempJsonList.push(_.extend(_.clone(origin), innerObject));
                    });
                } else {
                    jsonList.forEach(function(origin) {
                        var cloneObject = _.clone(origin);
                        cloneObject[key] = innerObject;
                        tempJsonList.push(cloneObject);
                    });
                }
            });

            jsonList = tempJsonList;
        } else if(_.isObject(object[key])) {
            _.map(jsonList, function(json) {
                return _.extend(json, object[key]);
            });
        } else {
            _.map(jsonList, function(json) {
                return json[key] = object[key];
            });
        }
    });
    return jsonList;
};


exportCsv(arr, ['title', 'description', 'name', 'scenario', 'test'], function(err, csv) {
    console.log(csv);
});