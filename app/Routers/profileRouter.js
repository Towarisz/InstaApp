const Utils = require("../utils.js");
const jwt = require("jsonwebtoken");
const fileController = require("../Controllers/fileController.js");
const Path = require("path");
const formidable = require("formidable");

const profileRouter = async (req, res) => {
     switch (req.method) {
          case "GET":
               if (req.url == "/api/profile") {
                    if (!req.headers.authorization) {
                         res.writeHead(401, { "content-type": "application/json;charset=utf-8" });
                         res.end(JSON.stringify({ message: "access denied" }, null, 5));
                         break;
                    }
                    let requestToken = req.headers.authorization.split(" ")[1];
                    if (jwt.verify(requestToken, process.env.jwt_secret_key) && Utils.activeTokens.findIndex((x) => x == requestToken) != -1) {
                         let decodedToken = jwt.decode(requestToken);
                         let uid = decodedToken.id;
                         let user = Utils.users.find((x) => x.id == uid);
                         res.writeHead(200, { "content-type": "application/json;charset=utf-8" });
                         res.end(JSON.stringify(user, null, 5));
                    } else {
                         res.writeHead(401, { "content-type": "application/json;charset=utf-8" });
                         res.end(JSON.stringify({ message: "access denied" }, null, 5));
                    }
               } else if (req.url.match(/\/api\/profile\/([0-9]+)/)) {
                    let id = req.url.match(/([0-9]+)/)[0];
                    user = Utils.users.find((x) => x.id == id);
                    let response = {
                         name: user.name,
                         lastName: user.lastName,
                    };
                    res.writeHead(200, { "content-type": "application/json;charset=utf-8" });
                    res.end(JSON.stringify(response, null, 5));
               } else if (req.url.match(/\/api\/profile\/pic\/([0-9]+)/)) {
                    let id = req.url.match(/([0-9]+)/)[0];
                    let path = Path.join(__dirname, "../upload/profile", "" + id + ".png");
                    if (fileController.exists(path)) {
                         res.writeHead(200, { "content-type": "image/png" });
                         res.end(fileController.readPhoto(path));
                    } else {
                         res.writeHead(404, { "content-type": "application/json;charset=utf-8" });
                         res.end(JSON.stringify({ message: "no profile pic" }, null, 5));
                    }
               }
               break;
          case "PATCH":
               if (req.url == "/api/profile") {
                    let data = await Utils.getRequestData(req);
                    data = JSON.parse(data);
                    if (!req.headers.authorization) {
                         res.writeHead(401, { "content-type": "application/json;charset=utf-8" });
                         res.end(JSON.stringify({ message: "access denied" }, null, 5));
                         break;
                    }
                    let requestToken = req.headers.authorization.split(" ")[1];
                    if (jwt.verify(requestToken, process.env.jwt_secret_key) && Utils.activeTokens.findIndex((x) => x == requestToken) != -1) {
                         let decodedToken = jwt.decode(requestToken);
                         let uid = decodedToken.id;
                         let profile = Utils.users.find((x) => x.id == uid);
                         profile.changeName(data.name, data.lastName);
                         res.writeHead(200, { "content-type": "application/json;charset=utf-8" });
                         res.end(JSON.stringify(profile, null, 5));
                    } else {
                         res.writeHead(401, { "content-type": "application/json;charset=utf-8" });
                         res.end(JSON.stringify({ message: "access denied" }, null, 5));
                    }
               }

               break;
          case "POST":
               if (req.url == "/api/profile") {
                    if (!req.headers.authorization) {
                         res.writeHead(401, { "content-type": "application/json;charset=utf-8" });
                         res.end(JSON.stringify({ message: "access denied" }, null, 5));
                         break;
                    }
                    let requestToken = req.headers.authorization.split(" ")[1];
                    if (jwt.verify(requestToken, process.env.jwt_secret_key) && Utils.activeTokens.findIndex((x) => x == requestToken) != -1) {
                         let decodedToken = jwt.decode(requestToken);
                         let uid = decodedToken.id;
                         let profile = Utils.users.find((x) => x.id == uid);
                         let form = new formidable.IncomingForm();
                         form.keepExtensions = true;
                         form.parse(req, function (error, fields, files) {
                              let fileName = uid;
                              let url = Path.join(__dirname, "../upload/profile", fileName + ".png");
                              fileController.saveProfilePhoto(files.file, url).then(() => {
                                   res.writeHead(200, { "content-type": "application/json;charset=utf-8" });
                                   res.end(JSON.stringify(profile, null, 5));
                              });
                         });
                    } else {
                         res.writeHead(401, { "content-type": "application/json;charset=utf-8" });
                         res.end(JSON.stringify({ message: "access denied" }, null, 5));
                    }
               }
               break;
     }
};

module.exports = profileRouter;
