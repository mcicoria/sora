var express = require('express'),
		fs      = require('fs');

var Canvas = require(__dirname + '/../models/canvas');

var app = module.exports = express.createServer();

app.get('/canvas/:image', function (req, res, next) {
	console.log('/canvas/:images')
	var path = req.params.image;
	Canvas.createImage(path, function (err, response) {
		console.log('createImage Callback')
		if (err) res.send('Broke', 404);

		res.json(response);
	});
});