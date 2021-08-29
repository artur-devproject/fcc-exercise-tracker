var validator = require('express-validator');
var ExerciseModel = require('../models/exercise');
var UserModel = require('../models/user');

// Create new exercise for the certain user
exports.postNewExercise = [
  // Validate and sanitize data provided
  validator.check('_id').trim().isLength({min: 24, max: 24}).withMessage('userId must have 24 characters')
    .isAlphanumeric().withMessage('UserId has non-alphanumeric characters').escape(),
  validator.check('description').trim().isLength({min: 1}).withMessage('Description required').escape(),
  validator.check('duration').trim().isInt({gt: 0}).withMessage('Duration must be an integer'),
  validator.check('date', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),

  // Process the request
  function(req, res, next) {
    // Extract the validation errors from the request
    const errors = validator.validationResult(req);

    if(!errors.isEmpty()) {
        // There is an error
        // Send error message
        res.send(errors);
    } else {
        // Data is valid
        // check if such username exists
        UserModel.findById(req.params._id, function(err, userFound) {
          if(err) return next(err);
          if(userFound) {
            ExerciseModel.create({
              user: userFound._id,
              description: req.body.description,
              duration: req.body.duration,
              date: req.body.date ? req.body.date : Date.now()
            }, function(err, exercise) {
              if(err) return next(err);
              res.json({
                "_id": exercise.user,
                "username": userFound.username,
                "date": exercise.date_formatted,
                "duration": exercise.duration,
                "description": exercise.description
              });
            });
          } else {
            res.send('User not found');
          }
        });
    }
  }
];

// Get the exercise information of the certain user
exports.getExercisesList = function(req, res, next) {
  UserModel.findById(req.params._id, function(err, userFound) {
    if(err) return next(err);
    if(userFound) {
      var query = ExerciseModel.find({"user": userFound._id});
      if(req.query.limit) query.limit(Number.parseInt(req.query.limit));
      if(req.query.from) query.where({ "date": { $gte: req.query.from } });
      if(req.query.to) query.where({ "date": { $lte: req.query.to } }); 
      query.exec(function(err, exercises) {
        if(err) return next(err);
        if(exercises.length>0) {
          res.json({"_id": userFound._id, "username": userFound.username, "count": exercises.length, 
            "log": exercises.map(function(item) {return {
              "description": item.description, 
              "duration": item.duration, 
              "date": item.date_formatted
            }})
          });
        } else {
          res.send('Exercises not found');
        }
      }); 
    } else {
      res.send('User not found');
    }
  });
};
