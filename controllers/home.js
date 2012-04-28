var express = require('express');

var app = module.exports = express.createServer();

app.get('/', function (req, res, next) {
	res.end('hello world');
});