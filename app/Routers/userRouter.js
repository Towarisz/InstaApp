const Utils = require("../utils.js")
const UserModel = require("../Models/UserModel") 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const users = [];
const userRouter = async (req, res) => {
    
    switch (req.method) {
        case "GET":
            if(req.url.match(/\/api\/user\/verify\/(.+)/)){
                token = req.url.match(/\/api\/user\/verify\/(.+)/)[1] // TODO naprawic pobieranie tokena
                user = users.find(el=>el.token == token)
                if(user != -1){
                    if(jwt.verify(token, process.env.token_secret_key)){
                        user.verify();
                        res.writeHead(200, { "content-type": "application/json;charset=utf-8" })
                        res.end(JSON.stringify({"message":"user verified you can login to your account"},null,5));
                    }else{
                        res.writeHead(404, { "content-type": "application/json;charset=utf-8" })
                        res.end(JSON.stringify({"error":"token expired"},null,5));
                    }
                }else{
                    res.writeHead(404, { "content-type": "application/json;charset=utf-8" })
                    res.end(JSON.stringify({"error":"user does not exist"},null,5));
                }
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
                        name: data.name
                    },
                    process.env.token_secret_key,
                    {
                        expiresIn: "1h" 
                    }
                );
                if(users.find(el=>{el.email == data.email && el.verfied == true})){
                    res.writeHead(404, { "content-type": "application/json;charset=utf-8" })
                    res.end(JSON.stringify({"error":"email already in use"},null,5));
                }else{
                    user = new UserModel(data.name,data.lastname,data.email,encryptedPassword,token);
                    users.push(user)
                    res.writeHead(200, { "content-type": "application/json;charset=utf-8" })
                    res.end(JSON.stringify({"message":`please verify on http://localhost:3000/api/user/verify/${user.token}`},null,5));
                }
              
            }else if(req.url == "/api/user/login"){
                let data = await Utils.getRequestData(req);
                data = JSON.parse(data);
                user = users.find(el=>el.email == data.email)
                if(user != -1){
                    if(user.verified){
                    let decrypted = await bcrypt.compare(data.passwd, user.passwd)
                    if(decrypted){
                        let token = await jwt.sign(
                            {
                                email: data.email,
                                name: data.name
                            },
                            process.env.token_secret_key,
                            {
                                expiresIn: "30d" 
                            }
                        );
                        user.giveNewToken(token);
                        res.writeHead(200, { "content-type": "application/json;charset=utf-8" })
                        res.end(JSON.stringify(user,null,5));
                                            
                    }else{
                        res.writeHead(404, { "content-type": "application/json;charset=utf-8" })
                    res.end(JSON.stringify({"error":"email or password is invalid"},null,5));
                    }
                }else{
                        res.writeHead(404, { "content-type": "application/json;charset=utf-8" })
                        res.end(JSON.stringify({"error":`user is not verified please verify on http://localhost:3000/api/user/verify/${user.token}`},null,5));
                    }
                }else{
                    res.writeHead(404, { "content-type": "application/json;charset=utf-8" })
                    res.end(JSON.stringify({"error":"email or password is invalid"},null,5));
                }
            }

            break;
    }
}

module.exports = userRouter
    