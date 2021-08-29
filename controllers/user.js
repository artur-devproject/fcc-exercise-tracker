const UserModel = require('../models/user');
const validator = require('express-validator');

// Create new user
exports.postNewUser = [
    // Validate and sanitize userID
    validator.check('username').trim().isLength({min: 1}).withMessage('Username must be specified').escape(),
    
    // Process the request
    function(req, res, next) {
        // Extract the validation errors from the request
        const errors = validator.validationResult(req);

        if(!errors.isEmpty()) {
            // There is an error
            // Send error message
            res.send(errors.errors[0].msg);
        } else {
            // username is valid
            // check if such username already exists and save it
            UserModel.findOne({username: req.body.username}, function(err, userFound) {
                if(err) return next(err);
                if(userFound) {
                    res.send('This user already exists');
                } else {
                    UserModel.create({username: req.body.username}, function(err, user) {
                        if(err) return next(err);
                        res.json({"username": user.username, "_id": user._id});
                    });
                }
            });
        }
    }
];

// Get list of all users
exports.getUsersList = function(req, res) {
    UserModel.find().exec(function(err, users) {
        if(err) return next(err);
        res.json(users);
    })
};