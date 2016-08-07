var router = require('express').Router();
var passport = require('passport');

router.post('/', passport.authenticate('local-login'), function(req,res) {
    res.json(req.user);
});

module.exports = router;