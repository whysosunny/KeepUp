var router = require('express').Router();

router.post('/', passport.authenticate('local-signup'), function(req,res) {
    res.json(req.user);
});