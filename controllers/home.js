var express = require('express');
var fs = require('fs'),
	crypto = require('crypto');

var app = module.exports = express.createServer();

app.get('/', function (req, res, next) {
	res.end('hello world');
});


app.get('/api/upload', function(req, res){
  res.send('<form method="post" enctype="multipart/form-data">'
    + '<p>Title: <input type="text" name="title" /></p>'
    + '<p>Image: <input type="file" name="image" /></p>'
    + '<p><input type="submit" value="Upload" /></p>'
    + '</form>');
});

app.post('/api/upload', function(req, res, next){
	if(!req.files) throw new Error("no files");

	console.log(req.files);
	//saves files
	fs.readFile(req.files.image.path, function (err, data) {
		if(err) next(err);
		var file_name = crypto.createHash('md5').digest("hex");
	  	var newPath = __dirname + "/../uploads/" + file_name + ".jpg";
	  	

	  	fs.writeFile(newPath, data, function (err) {
	  		console.log("saving file");
	  		if(err) next(err);
	  		//process image data
	  		//save to db
	  		//send back image data and 201 status code
	    	res.send("success",201);
	  	});
	});


});