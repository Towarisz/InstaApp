const TagModel = require("../Models/TagModel.js")

class TagsController{
    tagArray = [];
    constructor(){
        //Tymczasowa dopuki nie ma bazy danych
        this.tagArray = [
            "#love",
            "#instagood",
            "#fashion",
            "#photooftheday",
            "#art",
            "#photography",
            "#instagram",
            "#beautiful",
            "#picoftheday",
            "#nature",
            "#happy",
            "#cute",
            "#travel",
            "#style",
            "#followme",
            "#tbt",
            "#instadaily",
            "#repost",
            "#like4like",
            "#summer",
            "#beauty",
            "#fitness",
            "#food",
            "#selfie",
            "#me",
            "#instalike",
            "#girl",
            "#friends",
            "#fun",
            "#photo"
          ].map((el,i)=>new TagModel(i,el,0))
    }
    createTag(_name,_popularity){
        if(this.tagArray.findIndex((el)=>el.name == _name) == -1){
            const tag = new TagModel(this.tagArray.length>0?this.tagArray[this.tagArray.length-1].id+1:0,_name,_popularity)
            this.tagArray.push(tag)
            return tag
        }
        return -1
    }
    getTag(_id){
        return this.tagArray.find((el)=>el.id == _id)
    }
    getTagsRaw(){
        return this.tagArray.map(element =>element.name);
    }
    getTags(){
        return this.tagArray;
    }
    addTags(photo,[...tags]){
        tags.forEach(element => {
            photo.addTag(this.getTag(element.id))
        });
        return photo;
    }
}

const tagsController = new TagsController();
module.exports = tagsController;