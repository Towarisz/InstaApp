class Photo{
    id;
    album;
    author;
    originalName;
    url;
    lastChange;
    history;
    tags;
    constructor(_id,_album,_origName,_url,_author){
        this.id = _id;
        this.album = _album;
        this.originalName = _origName;
        this.url = _url;
        this.author = _author;
        this.lastChange = "Original";
        this.history = [
                {
                     "status": "Original",
                     "lastModifiedDate": this.id
                }
        ]
        this.tags = [];
    }
    update(_status,_timestamp){
        this.lastChange = _status;
        this.history.push(
            {
                "status": _status,
                "lastModifiedDate": _timestamp
            }
       )
    }
    addTag(tag){
        if(this.tags.findIndex(el=>el.id == tag.id) == -1){
            this.tags.push(tag)
        }
    }
    
}

module.exports = Photo