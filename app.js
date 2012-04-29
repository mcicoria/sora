
var Canvas = require('canvas'),
	Image = Canvas.Image
  , canvas = new Canvas(200,200)
  , ctx = canvas.getContext('2d')
  , http = require('http');

var img = new Image;

img.onload = function(){
    pixelMapping(img);
}

img.onerror = function(err){
  throw err;
};

img.src = __dirname + '/public/images/ipad_hero.jpg';

function pixelMapping(image) {
		var width = image.width
    , height = image.height
    , canvas = new Canvas(width, height)
    , ctx = canvas.getContext('2d');



	  ctx.drawImage(image, 0, 0, width, height);
 
    // Get the image data

    var gridData = [];
    var WIDTH_NUMS = 6;
    var HEIGHT_NUMS = 6;

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
        box.x_start = currentX;
        box.y_start = currentY;
        box.x_end = endX;
        box.y_end = endY;

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
        box.bar = k+1;

        gridData.push(box);
      }
    }
   
    console.log(gridData);
  }