const url = process.env.DB;
var mongoose = require('mongoose');

mongoose.connect(url, function(err, db){
    if (err) console.log('Unable to connect to DB. Error: ' + err);
    else console.log('Connection established to DB');
});