var express = require('express'),
 	fs = require('fs'),
	crypto = require('crypto'),
	knox = require('knox'), 
	http = require('http'), 
	multipart = require('multipart'),
	sys = require('sys');

var app = module.exports = express.createServer();

var client = knox.createClient({
    key: 'AKIAJJ52UTWQHJPMFFDA'
  , secret: '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'
  , bucket: 'soraapp'
});

app.get('/api/upload', function(req, res){
  res.send('<form method="post" enctype="multipart/form-data">'
    + '<p>Title: <input type="text" name="title" /></p>'
    + '<p>Image: <input type="file" name="image" /></p>'
    + '<p><input type="submit" value="Upload" /></p>'
    + '</form>');
});

app.post('/api/upload/old', function(req, p_res, next){
	if(!req.files) next(new Error("No files."));

	console.log(req.files);
	req.connection.setTimeout(30000);

	//todo: get magic json object from image processing
	
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

/*app.post('/api/upload', function(req, res, next){
	req.setEncoding('binary');
	var file = "";
	var file_name = crypto.createHash('md5')
						.update("" + (new Date()).getTime())
						.digest("hex") + ".jpg";

	var stream = new multipart.Stream(req);
	stream.addListener('part', function(part) {
		part.addListener('body', function(chunk) {
			var progress = (stream.bytesReceived / stream.bytesTotal * 100).toFixed(2);
			var mb = (stream.bytesTotal / 1024 / 1024).toFixed(1);

			sys.print("Uploading "+mb+"mb ("+progress+"%)\015");

			// chunk could be appended to a file if the uploaded file needs to be saved
			file+=chunk;
		});
	});

	console.log(file);


	stream.addListener('complete', function() {
		res.sendHeader(200, {'Content-Type': 'text/plain'});
		res.sendBody('Thanks for playing!');
		res.finish();
		sys.puts("\n=> Done");
	});

});*/
