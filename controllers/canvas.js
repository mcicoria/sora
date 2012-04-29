var express = require('express'),
		fs      = require('fs');

var Canvas = require(__dirname + '/../models/canvas');

var app = module.exports = express.createServer();

app.get('/canvas', function (req, res, next) {
	var path = __dirname + '/../public/images/discolight4.jpg';
	var path = "https://s3.amazonaws.com/soraapp/185c05f0a9830e8f7a2c4b80be369e7f.jpg";
	var path = "http://soraapp.s3.amazonaws.com/730572770f91cb563ab059acfbf96eff.jpg";
	var path = "http://soraapp.s3.amazonaws.com/493d145cbeb50d1760b93902aaa50d36.jpg";

	Canvas.createImage(path, function (err, response) {
		if (err) res.send('Broke', 404);

		res.json(response);
	});
});