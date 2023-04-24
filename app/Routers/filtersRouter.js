const Utils = require("../utils.js")
const filtersController = require("../Controllers/filtersController.js");
const filtersRouter = async (req, res) => {

    switch (req.method) {
        case "GET":
            if(req.url == req.url.match(/\/api\/filters\/metadata\/([0-9]+)/)){ 
                //pobranie metadata zdjecia
                res.writeHead(200, { "content-type": "application/json;charset=utf-8" })
                res.end(JSON.stringify(filtersController.getMetadata(req.url.match(/\/api\/photos\/([0-9]+)/)[1]),null,5));
            }
            break;
        case "PATCH":
            if (req.url == "/api/filters") {
                let data = await Utils.getRequestData(req);
                data = JSON.parse(data);
                if(newTag != -1){
                    res.writeHead(200, { "content-type": "application/json;charset=utf-8" })
                    res.end(JSON.stringify(newTag,null,5));
                }else{
                    res.end(JSON.stringify({"message":"Tag exists"},null,5))
                }
            }

            break;
    }
}

    module.exports = filtersRouter