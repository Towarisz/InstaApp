const sharp = require('sharp');
const jsonController = require('../Controllers/jsonController');
const path = require('path');

class FiltersController{
    rotate = async (photo,rotatedImageId,degrees)=>{
        await sharp(photo.url)
            .rotate(parseInt(degrees))
            .toFile(path.join(__dirname,"../","upload/",String(photo.album),rotatedImageId+"."+photo.url.split(".").pop()));
    }
    grayscale = async (photo,rotatedImageId)=>{
        await sharp(photo.url)
            .grayscale()
            .toFile(path.join(__dirname,"../","upload/",String(photo.album),rotatedImageId+"."+photo.url.split(".").pop()));
    }
    negate = async (photo,rotatedImageId)=>{
        await sharp(photo.url)
            .negate()
            .toFile(path.join(__dirname,"../","upload/",String(photo.album),rotatedImageId+"."+photo.url.split(".").pop()));
    }
    
}

const filtersController = new FiltersController();
module.exports = filtersController;