const Utils = require("../utils.js");
const tagsController = require("../Controllers/tagsController.js");
const tagsRouter = async (req, res) => {
     switch (req.method) {
          case "GET":
               if (req.url == "/api/tags/raw") {
                    // Pobranie wszystkich tagow
                    res.writeHead(200, { "content-type": "application/json;charset=utf-8" });
                    res.end(JSON.stringify(tagsController.getTagsRaw(), null, 5));
               } else if (req.url == "/api/tags") {
                    // Pobranie wszystkich tagow z konwersja na obiekt
                    res.writeHead(200, { "content-type": "application/json;charset=utf-8" });
                    res.end(JSON.stringify(tagsController.getTags(), null, 5));
               } else if (req.url.match(/\/api\/tags\/([0-9]+)/)) {
                    // Pobranie jednego taga
                    res.writeHead(200, { "content-type": "application/json;charset=utf-8" });
                    res.end(JSON.stringify(tagsController.getTag(req.url.match(/\/api\/tags\/([0-9]+)/)[1]), null, 5));
               }
               break;
          case "POST":
               if (req.url == "/api/tags") {
                    // Utworzenie tagu
                    let data = await Utils.getRequestData(req);
                    data = JSON.parse(data);
                    const newTag = tagsController.createTag(data.name, data.popularity);
                    if (newTag != -1) {
                         res.writeHead(200, { "content-type": "application/json;charset=utf-8" });
                         res.end(JSON.stringify(newTag, null, 5));
                    } else {
                         res.end(JSON.stringify({ message: "Tag exists" }, null, 5));
                    }
               }

               break;
     }
};

module.exports = tagsRouter;
