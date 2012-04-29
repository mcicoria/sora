//Modules
var express = require('express')
  , port = 3000
  , mongo_url = 'mongodb://localhost/sora';

GLOBAL.mu = require("mu2");
GLOBAL.mongoose = require("mongoose");

//Load enviroment settings if available
if(process.env.MONGOHQ_URL) mongo_url = process.env.MONGOHQ_URL;
if(process.env.PORT) port = process.env.PORT;

var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.listen(port);
app.use(require('./controllers/canvas'));
app.use(require('./controllers/upload'));
app.use(require('./controllers/home'));

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);