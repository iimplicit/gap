var express = require('express');
var router = express.Router();

var survey = require('../controllers/survey');
var user = require('../controllers/user');


/**
 * Survey CRUD
 * **/
router.post('/surveys', survey.create);

router.get('/surveys', survey.readList);
router.get('/surveys/:id', survey.read);

router.put('/surveys/:id', survey.update);
router.delete('/surveys/:id', survey.delete);

/**
 * User CRUD
 * **/
router.post('/users', user.create);
router.get('/users', user.read);
router.put('/users', user.update);
router.delete('/users', user.delete);

router.post('/login', user.login);


module.exports = router;
