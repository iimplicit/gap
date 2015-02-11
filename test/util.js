/**
 * Created by syntaxfish on 15. 2. 3..
 */

(function() {
    'use strict';
    var exportJson2Csv = require('../lib/util').exportJson2Csv;
    var expect = require('chai').expect;
    var fs = require('fs');
    var async = require('async');

    
    var in_csv = [
        require('./testcase/in_csv_01')
    ];
    var out_csv_path = [
        'test/testcase/out_csv_01.csv'
    ];
    var out_csv = [];
    
    async.times(out_csv_path.length, function(n, next) {
        fs.readFile(out_csv_path[n], function(err, file) {
            out_csv.push(file.toString());
            next();
        });
    },function done(error, results) {

    });


    describe('Test exportJson2Csv', function() {
        it('succeed export csv', function(done) {
            var testNumber = 0;

            exportJson2Csv(in_csv[testNumber], ['title', 'description', 'name', 'scenario', 'test'], function(err, csv){
                expect(err).to.be.a('null');
                expect(csv).to.be.a(out_csv[testNumber]);

                done();
            });
        });
    });

})();