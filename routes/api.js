var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');
var exerciseController = require('../controllers/exercise');

// Post new User
router.post('/users/', userController.postNewUser);

// Get the list of all users
router.get('/users/', userController.getUsersList);

// Post new Exercise
router.post('/users/:_id/exercises', exerciseController.postNewExercise);

// Get user's exercises list
router.get('/users/:_id/logs', exerciseController.getExercisesList);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Incorrect request. Please, try something else');
});

module.exports = router;
