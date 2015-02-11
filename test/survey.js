/**
 * Created by syntaxfish on 15. 2. 3..
 */

(function() {
    'use strict';
    var app = require('../app');
    var request = require('supertest');

    describe('POST /api/surveys', function() {
        it('failed create surveys ( INVALID_TOKEN )', function(done) {
            request(app)
                .post('/api/surveys')
                .expect('Content-type', /json/)
                .expect(401)
                .end(function(err, res) {
                    done(err, res);
                });
        });

        it('failed create surveys ( INVALID_TOKEN )', function(done) {
            request(app)
                .post('/api/surveys')
                .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGQwZTljMjdkMjIzMTZjOGI1ODMxM2MiLCJ1c2VybmFtZSI6InN5bnRheGZpc2giLCJwYXNzd29yZCI6InRlc3QifQ.EEOK0HtK18AjuMCUt537yPQL6mNyuG_GtAD6V2yLCTs')
                .expect('Content-type', /json/)
                .expect(404)
                .end(function(err, res) {
                    done(err, res);
                });
        });

        it('failed create surveys( JSON_MISSING )', function(done) {
            request(app)
                .post('/api/surveys')
                .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGQwZWUzOTJiYTgxNDExOTA2ZjM2ZjIiLCJ1c2VybmFtZSI6InN5bnRheGZpc2giLCJwYXNzd29yZCI6InRlc3QifQ.1JJUJYg4COzygVJ7OpPB-rXJQvs0MA5xlkDCKhVMwZI')
                .expect('Content-type', /json/)
                .expect(404)
                .end(function(err, res) {
                    done(err, res);
                });
        });

        it('sucess create surveys', function(done) {
            request(app)
                .post('/api/surveys')
                .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGQwZWUzOTJiYTgxNDExOTA2ZjM2ZjIiLCJ1c2VybmFtZSI6InN5bnRheGZpc2giLCJwYXNzd29yZCI6InRlc3QifQ.1JJUJYg4COzygVJ7OpPB-rXJQvs0MA5xlkDCKhVMwZI')
                .send({title: "test"})
                .expect('Content-type', /json/)
                .expect(200)
                .end(function(err, res) {
                    done(err, res);
                });
        });

    });

    //describe('GET /api/surveys', function() {
    //
    //});
    //
    //describe('UPDATE /api/surveys', function() {
    //
    //});
    //
    //describe('DELETE /api/surveys', function() {
    //
    //});

    
})();