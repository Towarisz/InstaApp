const Utils = require("../utils.js");
const UserModel = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userRouter = async (req, res) => {
     switch (req.method) {
          case "GET":
               if (req.url.match(/\/api\/user\/verify\/(.+)/)) {
                    token = req.url.replace("/api/user/verify/", "");

                    user = Utils.users.find((el) => el.token == token);
                    if (user) {
                         if (jwt.verify(token, process.env.jwt_secret_key)) {
                              user.verify();
                              res.writeHead(200, { "content-type": "application/json;charset=utf-8" });
                              res.end(JSON.stringify({ message: "user verified you can login to your account", success: true }, null, 5));
                         } else {
                              res.writeHead(404, { "content-type": "application/json;charset=utf-8" });
                              res.end(JSON.stringify({ message: "token expired", success: false }, null, 5));
                         }
                    } else {
                         res.writeHead(404, { "content-type": "application/json;charset=utf-8" });
                         res.end(JSON.stringify({ message: "user does not exist", success: false }, null, 5));
                    }
               } else if (req.url == "/api/user/logout") {
                    let requestToken = req.headers.authorization.split(" ")[1];
                    Utils.activeTokens = Utils.activeTokens.filter((x) => x != requestToken);
                    res.writeHead(200, { "content-type": "application/json;charset=utf-8" });
                    res.end(JSON.stringify({ message: "user logged out", success: true }, null, 5));
               } else if (req.url == "/api/user") {
                    res.writeHead(200, { "content-type": "application/json;charset=utf-8" });
                    res.end(JSON.stringify(Utils.users, null, 5));
               }
               break;
          case "POST":
               if (req.url == "/api/user/register") {
                    let data = await Utils.getRequestData(req);
                    data = JSON.parse(data);
                    let encryptedPassword = await bcrypt.hash(data.passwd, 15);
                    let token = await jwt.sign(
                         {
                              email: data.email,
                              name: data.name,
                         },
                         process.env.jwt_secret_key,
                         {
                              expiresIn: "1h",
                         }
                    );
                    if (
                         Utils.users.find((el) => {
                              el.email == data.email && el.verfied == true;
                         })
                    ) {
                         res.writeHead(404, { "content-type": "application/json;charset=utf-8" });
                         res.end(JSON.stringify({ message: "email already in use", success: false }, null, 5));
                    } else {
                         user = new UserModel(data.name, data.lastname, data.email, encryptedPassword, token);
                         Utils.users.push(user);
                         res.writeHead(200, { "content-type": "application/json;charset=utf-8" });
                         res.end(JSON.stringify({ message: `please verify on http://localhost:3000/api/user/verify/${user.token}`, success: true }, null, 5));
                    }
               } else if (req.url == "/api/user/login") {
                    let data = await Utils.getRequestData(req);
                    data = JSON.parse(data);
                    user = Utils.users.find((el) => el.email == data.email);
                    if (user != -1) {
                         if (user.verified) {
                              let decrypted = await bcrypt.compare(data.passwd, user.passwd);
                              if (decrypted) {
                                   let token = await jwt.sign(
                                        {
                                             id: user.id,
                                        },
                                        process.env.jwt_secret_key,
                                        {
                                             expiresIn: "30d",
                                        }
                                   );
                                   user.giveNewToken(token);
                                   Utils.activeTokens.push(token);
                                   res.setHeader("Authorization", "Bearer " + token);
                                   res.writeHead(200, { "content-type": "application/json;charset=utf-8" });
                                   res.end();
                              } else {
                                   res.writeHead(404, { "content-type": "application/json;charset=utf-8" });
                                   res.end(JSON.stringify({ message: "email or password is invalid", success: false }, null, 5));
                              }
                         } else {
                              res.writeHead(404, { "content-type": "application/json;charset=utf-8" });
                              res.end(JSON.stringify({ message: `user is not verified please verify on http://localhost:3000/api/user/verify/${user.token}`, success: false }, null, 5));
                         }
                    } else {
                         res.writeHead(404, { "content-type": "application/json;charset=utf-8" });
                         res.end(JSON.stringify({ message: "email or password is invalid", success: false }, null, 5));
                    }
               }

               break;
     }
};

module.exports = userRouter;
