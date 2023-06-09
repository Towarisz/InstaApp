const Utils = require("../utils.js");
const fileController = require("../Controllers/fileController.js");
const jsonController = require("../Controllers/jsonController.js");
const tagsController = require("../Controllers/tagsController.js");
const formidable = require("formidable");
const Path = require("path");
const jwt = require("jsonwebtoken");

const imageRouter = async (req, res) => {
     switch (req.method) {
          case "GET":
               if (req.url == "/api/photos") {
                    // Pobranie informacji na temat wszystkich zdjęć
                    res.writeHead(200, { "content-type": "application/json;charset=utf-8" });
                    res.end(JSON.stringify(jsonController.getAll(), null, 5));
               } else if (req.url.match(/\/api\/photos\/([0-9]+)/)) {
                    // Pobranie informacji na temat konkretnego zdjęcia po id
                    console.log("Pobranie zdjecia");
                    res.writeHead(200, { "content-type": "application/json;charset=utf-8" });
                    res.end(JSON.stringify(jsonController.getById(req.url.match(/\/api\/photos\/([0-9]+)/)[1]), null, 5));
               } else if (req.url.match(/\/api\/photos\/image\/([0-9]+)/)) {
                    image = jsonController.getById(req.url.match(/\/api\/photos\/image\/([([0-9]+)/)[1]);
                    let contentType;
                    let type = image.url.split(".").pop();
                    switch (type) {
                         case "jpg":
                              contentType = "image/jpg";
                              break;
                         case "jpeg":
                              contentType = "image/jpeg";
                              break;
                         case "png":
                              contentType = "image/png";
                              break;
                         case "mp4":
                              contentType = "video/mp4";
                              break;
                         default:
                              contentType = "image/text";
                              break;
                    }
                    res.writeHead(200, { "content-type": contentType });
                    let path = image.url.split("\\");
                    path[path.length - 1] = image.history[image.history.length - 1].lastModifiedDate + "." + type;
                    res.end(fileController.readPhoto(path.join("\\")));
               }
               break;
          case "POST":
               if (req.url == "/api/photos") {
                    // Przesłanie zdjęcia do zapisu na serwer
                    if (!req.headers.authorization) {
                         res.writeHead(401, { "content-type": "application/json;charset=utf-8" });
                         res.end(JSON.stringify({ message: "access denied" }, null, 5));
                         break;
                    }
                    let requestToken = req.headers.authorization.split(" ")[1];
                    if (jwt.verify(requestToken, process.env.jwt_secret_key) && Utils.activeTokens.findIndex((x) => x == requestToken) != -1) {
                         let decodedToken = jwt.decode(requestToken);
                         let uid = decodedToken.id;
                         let form = new formidable.IncomingForm();
                         form.keepExtensions = true;
                         form.parse(req, function (error, fields, files) {
                              let fileName = Date.now();
                              Utils.users.find((x) => x.id == uid).photos.push(fileName);
                              let url = Path.join(__dirname, "../upload", fileName + "", fileName + "." + files.file.name.split(".").pop());
                              fileController.savePhoto(files.file, fileName).then(() => {
                                   res.writeHead(200, { "content-type": "application/json;charset=utf-8" });
                                   res.end(JSON.stringify(jsonController.add(fileName, fileName, files.file.name, url, uid), null, 5));
                              });
                         });
                    } else {
                         res.writeHead(401, { "content-type": "application/json;charset=utf-8" });
                         res.end(JSON.stringify({ message: "token expired" }, null, 5));
                    }
               }

               break;
          case "DELETE":
               if (req.url.match(/\/api\/photos\/([0-9]+)/)) {
                    // Usunięcie podanego zdjęcia po id
                    if (!req.headers.authorization) {
                         res.writeHead(401, { "content-type": "application/json;charset=utf-8" });
                         res.end(JSON.stringify({ message: "access denied" }, null, 5));
                         break;
                    }
                    let requestToken = req.headers.authorization.split(" ")[1];
                    if (jwt.verify(requestToken, process.env.jwt_secret_key) && Utils.activeTokens.findIndex((x) => x == requestToken) != -1) {
                         let decodedToken = jwt.decode(requestToken);
                         let uid = decodedToken.id;
                         let id = req.url.match(/\/api\/photos\/([0-9]+)/)[1];
                         if (jsonController.getById(id).author == uid) {
                              jsonController.delete(id).then((photo) => {
                                   if (photo != -1) {
                                        let user = Utils.users.find((x) => x.id == uid);
                                        user.photos.split(
                                             user.photos.findIndex((x) => x == id),
                                             1
                                        );
                                        fileController.deleteFile(photo);
                                        res.writeHead(200, { "content-type": "application/json;charset=utf-8" });
                                        res.end(JSON.stringify({ message: "Deleted file with id: " + id }, null, 5));
                                   } else {
                                        res.writeHead(401, { "content-type": "application/json;charset=utf-8" });
                                        res.end(JSON.stringify({ message: "No File with id: " + id }, null, 5));
                                   }
                              });
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
          case "PATCH":
               let data = await Utils.getRequestData(req);
               data = JSON.parse(data);
               if (req.url == "/api/photos") {
                    // Update podanego zdjęcia po id
                    res.writeHead(200, { "content-type": "application/json;charset=utf-8" });
                    res.end(JSON.stringify(jsonController.update(data.id, data.status), null, 5));
               } else if (req.url == "/api/photos/tags") {
                    if (!req.headers.authorization) {
                         res.writeHead(401, { "content-type": "application/json;charset=utf-8" });
                         res.end(JSON.stringify({ message: "access denied" }, null, 5));
                         break;
                    }
                    let requestToken = req.headers.authorization.split(" ")[1];
                    if (jwt.verify(requestToken, process.env.jwt_secret_key) && Utils.activeTokens.findIndex((x) => x == requestToken) != -1) {
                         let decodedToken = jwt.decode(requestToken);
                         let uid = decodedToken.id;

                         if (jsonController.getById(data.id).author == uid) {
                              res.writeHead(200, { "content-type": "application/json;charset=utf-8" });
                              res.end(JSON.stringify(tagsController.addTags(jsonController.getById(data.id), data.tags), null, 5));
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

module.exports = imageRouter;
