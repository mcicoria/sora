var express = require('express'),
		fs      = require('fs');

var Canvas = require(__dirname + '/../models/canvas');

var app = module.exports = express.createServer();

app.get('/canvas', function (req, res, next) {
	var path = __dirname + '/../public/images/ipad_hero.jpg';

	Canvas.createImage(path, function (err, response) {
		if (err) res.send('Broke', 404);

		res.json(response);
	});
});