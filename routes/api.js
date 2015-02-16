var express = require('express');
var router = express.Router();

var survey = require('../controllers/survey');
var user = require('../controllers/user');
var surveyResult = require('../controllers/surveyResult');

var Authorization = require('../lib/authorization');


/**
 * Survey CRUD
 * **/
router.post('/surveys', Authorization.token, survey.create);

router.get('/surveys', Authorization.token, survey.readList);
router.get('/surveys/:id', survey.read);

router.put('/surveys/:id', Authorization.token, survey.update);
router.delete('/surveys/:id', Authorization.token, survey.delete);

router.post('/surveys/submit/:id', surveyResult.submit);

router.post('/surveys/:id/copy', Authorization.token, survey.copy);
router.get('/surveys/:id/export', Authorization.token, survey.exportData);

/**
 * User CRUD
 * **/

router.post('/users', user.create);
router.get('/users', user.read);
router.put('/users', Authorization.token, user.update);
router.delete('/users', Authorization.token, user.delete);

router.post('/login', user.login);


module.exports = router;