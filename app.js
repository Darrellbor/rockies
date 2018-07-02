// C:\users\DELL\workspace\rockies
require('./api/data/db');
var express = require('express');
var app = express();
var path = require('path');
var cors = require('cors');
var routes = require('./api/routes');
var user_routes = require('./api/routes/users');
var settings_routes = require('./api/routes/settings');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');

app.set('port', 3000);

app.use(cors());

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', routes);

app.use('/api', user_routes);

app.use('/api', settings_routes);

var server = app.listen(app.get('port'), function() {
    var port = server.address().port;
    console.log('App listening on port ' + port);
});