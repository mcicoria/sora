var express = require('express');
var fs = require('fs'),
	crypto = require('crypto'),
	knox = require('knox');

var app = module.exports = express.createServer();

var client = knox.createClient({
    key: 'AKIAJJ52UTWQHJPMFFDA'
  , secret: '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'
  , bucket: 'soraapp'
});

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

app.post('/api/upload', function(req, p_res, next){
	if(!req.files) next(new Error("No files."));

	req.connection.setTimeout(30000);

	//get magic json object from image processing
	fs.readFile(req.files.image.path, function(err, buf){
		var file_name = crypto.createHash('md5')
						.update("" + (new Date()).getTime())
						.digest("hex") + ".jpg";

		var req = client.put(file_name, {
			'Content-Length': buf.length
			, 'Content-Type': 'image/jpg'
		});

		req.on('response', function(res){
			if (200 == res.statusCode) {
		  		console.log('saved to %s', req.url);
	  			p_res.send("success: " + req.url,201);
		  		//save json object and image url to db
			}
		});

		req.end(buf);
	});

});