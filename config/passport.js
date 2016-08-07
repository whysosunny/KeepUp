var LocalStrategy = require('passport-local').Strategy;
var User = require('../server/models/user.js');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    passport.use('local-signup', new LocalStrategy({
            usernameField: 'username',
            password: 'password',
            passReqToCallback: true
        },
        function(req, username, password, done) {
            User.findOne({'username': username}, function(err,user) {
                if(err) {
                    return done(err);
                }
                if(user) {
                    return done(null, false)
                } else {
                    var newUser = new User();
                    newUser.username = username;
                    newUser.password = newUser.generateHash(password);
                    
                    newUser.save(function(err, user) {
                        if(err) {
                            throw err;
                        }
                        return done(null, user);
                    });
                }
            })
        }
    
    ));
};