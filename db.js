var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/keepup", function(err,db) {
    if(err) {
        console.log(err);
    } else {
        console.log("Db ready!");
    }
});

module.exports = mongoose;
