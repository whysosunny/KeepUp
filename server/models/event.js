var db = require('../../db');

var eventSchema = db.Schema({
    title: String,
    description: String,
    location: String,
    date: String,
    time: String,
    created: {
        type: Date,
        default: Date.now()
    },
    creator: {
        type: db.Schema.Types.ObjectId,
        ref: 'User'
    },
    going: [{
        type: db.Schema.Types.ObjectId,
        ref: 'User'
    }],
    interested: [{
        type: db.Schema.Types.ObjectId,
        ref: 'User'
    }],
    notInterested: [{
        type: db.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = db.model('Event', eventSchema);

//579618d3a84ff91870c53087