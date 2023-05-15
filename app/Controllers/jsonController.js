const Photo = require("../Models/PhotoModel.js")

class JsonController{
    photoArray = [];

    add(_id,_album,_origName,_url){
        let photo = new Photo(_id,_album,_origName,_url);
        this.photoArray.push(photo);
        return photo;
    }
    getAll(){
        return this.photoArray;
    }

    getById(_id){
        return this.photoArray.find(element => element.id == _id)
    }
    getPath(_id){
        return this.photoArray.find(element => element.id == _id)
    }

    update(_id,status){
        let photo = this.photoArray.find(element => element.id == _id)
        photo.update(status,Date.now());
        return photo;
    }
    async delete(_id){
        let index = this.photoArray.findIndex(element => element.id == _id);
        if(index != -1){
            let photo = this.photoArray.splice(index,1)
            return photo[0];
        }
        return -1
    }
}

const jsonController = new JsonController();
module.exports = jsonController