var router = require('express').Router();
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt');
var config = require('../../../config');
var User = require('../../models/user');
var Event = require('../../models/event');

router.get('/', function(req,res,next) {
    Event.find({}).populate('creator').exec(function(err,events) {
        if(err) {
            console.log(err);
            next(err);
        }
        res.send(events);
    });
});

router.post('/', function(req,res,next) {
    var event = new Event({
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        dateTime: req.body.dateTime,
        creator: req.auth._id,
        going: [req.auth._id]
    });

    event.save(function(err,event) {
        if(err) {
            next(err);
        } else {
            User.update({ _id: req.auth._id }, { $push: { events: event._id } }, function(err) {
                if(err) {
                    console.log(err);
                }
            });
            res.send(event);
        }
    });

});



module.exports = router;