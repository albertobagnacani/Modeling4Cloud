var app = require('./app');
var port = process.env.PORT || 3100;

var server = app.listen(port, function(){
    console.log("Server started at port " + port);
});