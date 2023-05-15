const Utils = require("../utils.js")
const filtersController = require("../Controllers/filtersController.js");
const jsonController = require('../Controllers/jsonController.js');

const filtersRouter = async (req, res) => {

    switch (req.method) {
        case "GET":
            if(req.url.match(/\/api\/filters\/metadata\/([0-9]+)/)){
                //pobranie metadata zdjecia
                photo = jsonController.getById(req.url.match(/\/api\/filters\/metadata\/([0-9]+)/)[1])
                if(photo){
                    res.writeHead(200, { "content-type": "application/json;charset=utf-8" })
                    res.end(JSON.stringify(await Utils.getMetadata(photo.url),null,5));
                }else{
                    res.writeHead(404, { "content-type": "application/json;charset=utf-8" })
                    res.end(JSON.stringify({"error":"photo does not exist"},null,5));
                }
            }
            break;
        case "PATCH":
            if (req.url == "/api/filters") {
                let data = await Utils.getRequestData(req);
                data = JSON.parse(data);
                photo = jsonController.getById(data.id)
                if(photo){
                    switch(data.filter){
                        case "ROTATE":
                            updatedPhoto = await jsonController.update(data.id,"ROTATE")
                            filtersController.rotate(photo,updatedPhoto.history.slice(-1)[0].lastModifiedDate,data.filterAction)
                        break;
                    }
                    res.writeHead(200, { "content-type": "application/json;charset=utf-8" })
                    res.end(JSON.stringify(updatedPhoto,null,5));
                }else{
                    res.writeHead(404, { "content-type": "application/json;charset=utf-8" })
                    res.end(JSON.stringify({"message":"photo does not exist"},null,5))
                }
            }

            break;
    }
}

    module.exports = filtersRouter