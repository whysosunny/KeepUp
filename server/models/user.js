var db = require('../../db.js');
var bcrypt = require('bcrypt');

var userSchema = db.Schema({
    firstName : {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    events: [{
        type: db.Schema.Types.ObjectId,
        ref: 'Event'
    }]
});

userSchema.methods.generateHash = function(password) {
    bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    bcrypt.compareSync(password, this.password);
};

module.exports = db.model('User',userSchema);