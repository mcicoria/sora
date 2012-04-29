var SoraImage = new Schema({  
    url: { type: String, required: true },  
    colors: { type: Array, required: false }, 
});

mongoose.model('SoraImage', SoraImage); 


