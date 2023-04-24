const fs = require("fs");
const Path = require('path');

class FileController{
   async createDir(name){
      if(!fs.existsSync(Path.join(__dirname, 'upload',name))){
         return fs.mkdir(Path.join(__dirname, 'upload',name),(err) => {
            if (err) {
               return console.error(err);
            }
         })
      }
      return
   }
   async createFile(fileData,fileName,path){
      let savePath = Path.join(__dirname, 'upload',path,fileName+"."+fileData.name.split(".").pop());
      return fs.writeFile(savePath,fs.readFileSync(fileData.path), function (error) {
         if (error) throw error
     })
   }
   async savePhoto(file,fileName,fields){
      this.createDir(fields["album"]).then(()=>{
         return this.createFile(file,fileName,fields["album"])
      })
   }
   deleteFile(file){
      fs.rmSync(file.url);
   }
}

const fileController = new FileController();
module.exports = fileController