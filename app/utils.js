const sharp = require("sharp");

class Utils{
    getRequestData = async (req) => {

        return new Promise((resolve, reject) => {
            try {
    
                let body = "";
    
                req.on("data", (part) => {
                    body += part.toString();
                });
    
                req.on("end", () => {
                    // mamy dane i zwracamy z promisy
                    resolve(body);
                });
    
            } catch (error) {
                reject(error);
            }
        })
    
    }

    getMetadata = async (path) => {
        return new Promise(async (resolve, reject) => {
        try {
    
            if (path) {
                let meta = await sharp(path)
                    .metadata()
                    console.log(meta);
                resolve(meta)
            }
            else {
                resolve("url_not_found")
            }
    
        } catch (err) {
            reject(err.mesage)
        }
    })
}
}

let utils = new Utils();

module.exports = utils;