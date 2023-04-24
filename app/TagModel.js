class TagModel{
    id;
    name;
    popularity;
    constructor(_id,_name,_popularity){
        this.id = _id;
        this.name = _name;
        this.popularity = _popularity;
    }

}

module.exports = TagModel;