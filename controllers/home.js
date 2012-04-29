var express = require('express');
var fs = require('fs'),
	crypto = require('crypto');

var app = module.exports = express.createServer();

app.get('/', function (req, res, next) {
	res.end('hello world');
});

app.post('/api/upload', function(req, res, next)){
	if(!req.files) throw new Error("no files");

	//saves files
	fs.readFile(req.files.displayImage.path, function (err, data) {
		var file_name = crypto.createHash('md5');
	  	var newPath = __dirname + "/uploads/" + file_name + ".jpg";
	  	fs.writeFile(newPath, data, function (err) {
	  		if(err) next(err);
	  		//process image data
	  		//save to db
	  		//send back image data and 201 status code
	    	res.send("success",201);
	  	});
	});


});