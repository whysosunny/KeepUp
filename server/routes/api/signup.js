var router = require('express').Router();
var passport = require('passport');

router.post('/', passport.authenticate('local-signup'), function(req,res) {
    console.log(req.user);
    res.json(req.user);
});



module.exports = router;

