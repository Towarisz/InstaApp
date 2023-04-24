const http = require('http');
const imageRouter = require("./app/Routers/imageRouter")
const tagsRouter = require("./app/Routers/tagsRouter")
const filtersRouter = require("./app/Routers/filtersRouter")

http
 .createServer(async (req, res) => {
    if (req.url.search("/api/photos") != -1) {
        await imageRouter(req, res)
     }else if (req.url.search("/api/tags") != -1) {
        await tagsRouter(req, res)
     }else if (req.url.search("/api/filters") != -1) {
      await filtersRouter(req, res)
   }
   })
 .listen(3000, () => console.log("listen on 3000"))