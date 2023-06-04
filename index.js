const http = require("http");
require("dotenv").config();

const imageRouter = require("./app/Routers/imageRouter");
const tagsRouter = require("./app/Routers/tagsRouter");
const filtersRouter = require("./app/Routers/filtersRouter");
const userRouter = require("./app/Routers/userRouter");
const profileRouter = require("./app/Routers/profileRouter");

http.createServer(async (req, res) => {
     if (req.url.search("/api/photos") != -1) {
          await imageRouter(req, res);
     } else if (req.url.search("/api/tags") != -1) {
          await tagsRouter(req, res);
     } else if (req.url.search("/api/filters") != -1) {
          await filtersRouter(req, res);
     } else if (req.url.search("/api/user") != -1) {
          await userRouter(req, res);
     } else if (req.url.search("/api/profile") != -1) {
          await profileRouter(req, res);
     } else {
          res.writeHead(400);
          res.end();
     }
}).listen(3000, () => console.log("listen on 3000"));
