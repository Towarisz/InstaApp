const Utils = require("../utils.js")
const fileController = require("../Controllers/fileController.js")
const jsonController = require("../Controllers/jsonController.js")
const tagsController = require("../Controllers/tagsController.js")
const formidable = require("formidable")
const Path = require('path');

const imageRouter = async (req, res) => {

    switch (req.method) {
    case "GET":
        if(req.url == "/api/photos"){ 
            // Pobranie informacji na temat wszystkich zdjęć
            res.writeHead(200, { "content-type": "application/json;charset=utf-8" })
            res.end(JSON.stringify(jsonController.getAll(),null,5));
        }else if(req.url.match(/\/api\/photos\/([0-9]+)/)){
            // Pobranie informacji na temat konkretnego zdjęcia po id
            res.writeHead(200, { "content-type": "application/json;charset=utf-8" })
            res.end(JSON.stringify(jsonController.getById(req.url.match(/\/api\/photos\/([0-9]+)/)[1]),null,5));
        }
        break;
    case "POST":
        if (req.url == "/api/photos") {
            // Przesłanie zdjęcia do zapisu na serwer
            let form = new formidable.IncomingForm();
            form.keepExtensions = true;
            form.parse(req, function (error, fields, files) {
                let fileName = Date.now();
                let url = Path.join(__dirname, '../upload',fields["album"],fileName+"."+files.file.name.split(".").pop());
                fileController.savePhoto(files.file,fileName,fields).then(()=>{
                    res.writeHead(200, { "content-type": "application/json;charset=utf-8" })
                    res.end(JSON.stringify(jsonController.add(fileName,fields["album"],files.file.name,url),null,5))
                })
            });
        }

        break;
    case "DELETE":
        if(req.url.match(/\/api\/photos\/([0-9]+)/)){
            // Usunięcie podanego zdjęcia po id
            let id = req.url.match(/\/api\/photos\/([0-9]+)/)[1]
            res.writeHead(200, { "content-type": "text/plain" })
            jsonController.delete(id).then((photo)=>{
                if(photo != -1){
                    fileController.deleteFile(photo)
                    res.end("Deleted file with id: " + id)
                }else{
                    res.end("No File with id: " + id)
                }
            })
            
        }
        break;
    case "PATCH":
        let data = await Utils.getRequestData(req);
            data = JSON.parse(data);
        if(req.url == "/api/photos"){
            // Update podanego zdjęcia po id
            res.writeHead(200, { "content-type": "application/json;charset=utf-8" })
            res.end(JSON.stringify(jsonController.update(data.id,data.status),null,5))
        }else if(req.url == "/api/photos/tags"){
            
            res.writeHead(200, { "content-type": "application/json;charset=utf-8" })
            res.end(JSON.stringify(tagsController.addTags(jsonController.getById(data.id),data.tags),null,5))
        }
        break;
    }
    }

    module.exports = imageRouter
    