var Canvas = require('canvas'),
    Image = Canvas.Image,
    canvas = new Canvas(200,200),
    ctx = canvas.getContext('2d'),
    fs = require('fs'),
    request = require('request'),
    http = require('http');

var Can = exports;

exports.createImage = createImage;
exports.pixelMapping = pixelMapping;
exports.getReturnJSON = getReturnJSON;
exports.getColor = getColor;
exports.numBeat = 16;

function createImage(path, callback) {
  var options = {
    host: 'soraapp.s3.amazonaws.com',
    port: 80,
    path: '/' + path,
    method: 'GET'
  };

var request = http.get(options, function(res){
    var imagedata = ''
    res.setEncoding('binary')

    res.on('data', function(chunk){
        imagedata += chunk
    })

    res.on('end', function(){
        var filePath = __dirname + '/../public/images' + options.path;

        fs.writeFile(filePath, imagedata, 'binary', function(err){
            if (err) throw err
        
            pixelMapping(filePath, callback);
        })
    })

})
  
}

function pixelMapping(imagePath, callback) {
  var image = new Image;
  

  image.onload = function () {
    var width = image.width,
        height = image.height,
        canvas = new Canvas(width, height),
        ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0, width, height);
 
    // Get the image data

    var gridData = [];
    var WIDTH_NUMS = Can.numBeat;
    var HEIGHT_NUMS = Can.numBeat;

    var currentX = 0;
    var currentY = 0;
    var gridWidth = image.width/WIDTH_NUMS;
    var gridHeight = image.height/HEIGHT_NUMS;
    var endX = 0;
    var endY = 0;

    for(var k = 0; k < WIDTH_NUMS; k++){
      for(var l = 0; l < HEIGHT_NUMS; l++){
        currentX = (k*gridWidth);
        currentY = (l*gridHeight);

        endX = ((k+1)*gridWidth);
        endY = ((l+1)*gridHeight);

        var box = {};
            box.x = {};
            box.y = {};

        box.x.start = currentX;
        box.x.end = endX;
        box.y.start = currentY;
        box.y.end = endY;

        var image_data = ctx.getImageData(currentX, currentY,  gridWidth, gridHeight);
        var image_data_array = image_data.data;
     
        var r = 0;
        var g = 0;
        var b = 0;
        var count = 0;

        for (var i = 0, j = image_data_array.length; i < j; i+=4) {
          r += image_data_array[i];
          g += image_data_array[i+1];
          b += image_data_array[i+2];
          count+=1;
        }

        box.r = r/count;
        box.g = g/count;
        box.b = b/count;
        box.beat = k+1;

        gridData.push(box);
      }
    }

    // console.log(gridData);

   Can.getReturnJSON(gridData, callback);
 };

 image.src = imagePath;
}

function getReturnJSON(mappings, callback) {
    var rval = new Array();
    var barData = new Array();
    var beatData = {};
    var currentBar = 1;
    var currentBeat = 1;
    var beatsPerBar = 4;

    for(var i=0; i<mappings.length; i++) {
        var box = mappings[i];

        var color = Can.getColor(box.r,box.g,box.b);
        if(beatData[color]==null) {
            beatData[color] = 1;
        }
        else {
            beatData[color] = beatData[color]+1;
        }

        if(i==mappings.length-1 || currentBeat != mappings[i+1].beat) {
            barData.push(beatData);
            beatData = {};
            currentBeat += 1;
        }

        // need to multipley
        if(i==mappings.length-1 || ((i+1) % (beatsPerBar*Can.numBeat)) == 0)  {
            rval.push(barData);
            barData = new Array(); 
            currentBar +=1;
        }
    }

    // console.log(rval);
    callback(null, rval);
}


function getColor(r,g,b) {
    var colorMappings = [
        {"color":"red","rgb":[255,0,0]},
        {"color":"yellow","rgb":[255,255,0]},
        {"color":"purple","rgb":[255,0,255]},
        {"color":"green","rgb":[0,255,0]},
        {"color":"blue","rgb":[0,0,255]},
        {"color":"white","rgb":[255,255,255]},
        //{"color":"black","rgb":[0,0,0]}
    ];
    var best = 255*3;
    var color;

    for(var i=0; i<colorMappings.length; i++) {
        var rgb = colorMappings[i].rgb;
        var sum = Math.abs(rgb[0] - r) + Math.abs(rgb[1] - g) + Math.abs(rgb[2] - b);
        if(sum < best) {
            best = sum;
            color = colorMappings[i].color;
        }
    }
    return color;
}