const Utils = require("../utils.js");
const filtersController = require("../Controllers/filtersController.js");
const jsonController = require("../Controllers/jsonController.js");

const filtersRouter = async (req, res) => {
     switch (req.method) {
          case "GET":
               if (req.url.match(/\/api\/filters\/metadata\/([0-9]+)/)) {
                    //pobranie metadata zdjecia
                    photo = jsonController.getById(req.url.match(/\/api\/filters\/metadata\/([0-9]+)/)[1]);
                    if (photo) {
                         res.writeHead(200, { "content-type": "application/json;charset=utf-8" });
                         res.end(JSON.stringify(await Utils.getMetadata(photo.url), null, 5));
                    } else {
                         res.writeHead(404, { "content-type": "application/json;charset=utf-8" });
                         res.end(JSON.stringify({ message: "photo does not exist" }, null, 5));
                    }
               }
               break;
          case "PATCH":
               if (req.url == "/api/filters") {
                    let data = await Utils.getRequestData(req);
                    data = JSON.parse(data);
                    if (!req.headers.authorization) {
                         res.writeHead(401, { "content-type": "application/json;charset=utf-8" });
                         res.end(JSON.stringify({ message: "access denied" }, null, 5));
                         break;
                    }
                    let requestToken = req.headers.authorization.split(" ")[1];
                    if (jwt.verify(requestToken, process.env.jwt_secret_key)) {
                         let decodedToken = jwt.decode(requestToken);
                         let uid = decodedToken.id;
                         photo = jsonController.getById(data.id);
                         if (photo.author == uid) {
                              if (photo) {
                                   switch (data.filter) {
                                        case "ROTATE":
                                             updatedPhoto = await jsonController.update(data.id, "ROTATE");
                                             filtersController.rotate(photo, updatedPhoto.history.slice(-1)[0].lastModifiedDate, data.filterAction);
                                             break;
                                        case "GRAYSCALE":
                                             updatedPhoto = await jsonController.update(data.id, "GRAYSCALE");
                                             filtersController.grayscale(photo, updatedPhoto.history.slice(-1)[0].lastModifiedDate);
                                             break;
                                        case "NEGATE":
                                             updatedPhoto = await jsonController.update(data.id, "NEGATE");
                                             filtersController.negate(photo, updatedPhoto.history.slice(-1)[0].lastModifiedDate);
                                             break;
                                   }
                                   res.writeHead(200, { "content-type": "application/json;charset=utf-8" });
                                   res.end(JSON.stringify(updatedPhoto, null, 5));
                              } else {
                                   res.writeHead(404, { "content-type": "application/json;charset=utf-8" });
                                   res.end(JSON.stringify({ message: "photo does not exist" }, null, 5));
                              }
                         } else {
                              res.writeHead(401, { "content-type": "application/json;charset=utf-8" });
                              res.end(JSON.stringify({ message: "permition denied" }, null, 5));
                         }
                    } else {
                         res.writeHead(401, { "content-type": "application/json;charset=utf-8" });
                         res.end(JSON.stringify({ message: "token expired" }, null, 5));
                    }
               }

               break;
     }
};

module.exports = filtersRouter;
