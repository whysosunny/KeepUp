var db = require('../../db.js');

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

module.exports = db.model('User',userSchema);