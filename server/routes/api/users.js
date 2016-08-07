var router = require('express').Router();
var bcrypt = require('bcrypt');
var config = require('../../../config');
var jwt = require('jwt-simple');
var User = require('../../models/user');

router.get('/', function(req,res,next) {
    User.findOne({username: req.user.username})
        .select('firstName lastName username')
        .exec(function(err,user) {
            if(err) {
                next(err);
            }
            res.json(user);
    });
});

// router.post('/', function(req,res,next) {
//     User.findOne({username: req.body.username}, function(err,user) {
//         if(user) {
//             res.sendStatus(406);
//         }
//     });
//     bcrypt.hash(req.body.password, 10, function(err,hash) {
//         if(err) {
//             console.log("here" +err);
//         } else {
//             var user = new User({
//                 firstName: req.body.firstName,
//                 lastName: req.body.lastName,
//                 username: req.body.username
//             });
//             user.password = hash;
//
//             user.save(function(err,user) {
//                 if(err) {
//                     next(err);
//                 }else {
//                     res.sendStatus(201);
//                 }
//             });
//         }
//     });
// });

module.exports = router;