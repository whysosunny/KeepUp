var router = require('express').Router();
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt');
var config = require('../../../config');
var User = require('../../models/user');

router.post('/', function(req,res,next) {
    
    User.findOne({username: req.body.username}, function(err,user) {
        if(err) {
            return next(err);
        } else if(!user) {
            console.log("User not found!");
            res.sendStatus(401);
        } else {
            bcrypt.compare(req.body.password, user.password, function(err,valid) {
                if(err) {
                    return next(err);
                } else if(!valid) {
                    console.log("Invalid Password!");
                    res.sendStatus(401);
                } else {
                    var token = jwt.encode({
                        username: user.username,
                        _id: user._id
                    }, config.secret);
                    res.send(token);
                }
            });
        }
    });
});

module.exports = router;