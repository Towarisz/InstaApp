const Utils = require("../utils.js");
const jwt = require("jsonwebtoken");

const profileRouter = async (req, res) => {
     switch (req.method) {
          case "GET":
               if (req.url == "/api/profile") {
                    if (!req.headers.authorization) {
                         res.writeHead(401, { "content-type": "application/json;charset=utf-8" });
                         res.end(JSON.stringify({ error: "access denied" }, null, 5));
                         break;
                    }
                    let requestToken = req.headers.authorization.split(" ")[1];
                    if (jwt.verify(requestToken, process.env.jwt_secret_key) && Utils.activeTokens.findIndex(requestToken) != -1) {
                         let decodedToken = jwt.decode(requestToken);
                         let uid = decodedToken.id;

                         res.writeHead(200, { "content-type": "application/json;charset=utf-8" });
                         res.end(
                              JSON.stringify(
                                   Utils.users.find((x) => x.id == uid),
                                   null,
                                   5
                              )
                         );
                    } else {
                         res.writeHead(401, { "content-type": "application/json;charset=utf-8" });
                         res.end(JSON.stringify({ error: "access denied" }, null, 5));
                    }
               }
               break;
          case "PATCH":
               if (req.url == "/api/profile") {
                    let data = await Utils.getRequestData(req);
                    data = JSON.parse(data);
                    if (!req.headers.authorization) {
                         res.writeHead(401, { "content-type": "application/json;charset=utf-8" });
                         res.end(JSON.stringify({ error: "access denied" }, null, 5));
                         break;
                    }
                    let requestToken = req.headers.authorization.split(" ")[1];
                    if (jwt.verify(requestToken, process.env.jwt_secret_key) && Utils.activeTokens.findIndex(requestToken) != -1) {
                         let decodedToken = jwt.decode(requestToken);
                         let uid = decodedToken.id;
                         let profile = Utils.users.find((x) => x.id == uid);
                         profile.changeName(data.name, data?.lastname);
                         res.writeHead(200, { "content-type": "application/json;charset=utf-8" });
                         res.end(JSON.stringify(profile, null, 5));
                    } else {
                         res.writeHead(401, { "content-type": "application/json;charset=utf-8" });
                         res.end(JSON.stringify({ error: "access denied" }, null, 5));
                    }
               }

               break;
          case "POST":
               if (req.url == "/api/profile") {
                    let data = await Utils.getRequestData(req);
                    data = JSON.parse(data);
                    if (!req.headers.authorization) {
                         res.writeHead(401, { "content-type": "application/json;charset=utf-8" });
                         res.end(JSON.stringify({ error: "access denied" }, null, 5));
                         break;
                    }
                    let requestToken = req.headers.authorization.split(" ")[1];
                    if (jwt.verify(requestToken, process.env.jwt_secret_key) && Utils.activeTokens.findIndex(requestToken) != -1) {
                         let decodedToken = jwt.decode(requestToken);
                         let uid = decodedToken.id;
                         let profile = Utils.users.find((x) => x.id == uid);
                         let form = new formidable.IncomingForm();
                         form.keepExtensions = true;
                         form.parse(req, function (error, fields, files) {
                              let fileName = uid;
                              let url = Path.join(__dirname, "../upload/profile", fileName + "." + files.file.name.split(".").pop());
                              fileController.savePhoto(files.file, fileName).then(() => {
                                   res.writeHead(200, { "content-type": "application/json;charset=utf-8" });
                                   res.end(JSON.stringify(profile, null, 5));
                              });
                         });
                    } else {
                         res.writeHead(401, { "content-type": "application/json;charset=utf-8" });
                         res.end(JSON.stringify({ error: "access denied" }, null, 5));
                    }
               }
               break;
     }
};

module.exports = profileRouter;
