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
}

let utils = new Utils();

module.exports = utils;