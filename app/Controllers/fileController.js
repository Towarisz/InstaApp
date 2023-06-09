const fs = require("fs");
const Path = require("path");

class FileController {
     async createDir(name) {
          if (!fs.existsSync(Path.join(__dirname, "../upload", name + ""))) {
               return fs.mkdir(Path.join(__dirname, "../upload", name + ""), (err) => {
                    if (err) {
                         return console.error(err);
                    }
               });
          }
          return;
     }
     async createFile(fileData, fileName, savepath) {
          let savePath = Path.join(__dirname, "../upload", fileName + "", fileName + "." + fileData.name.split(".").pop());
          return fs.writeFile(savePath, fs.readFileSync(fileData.path), function (error) {
               if (error) throw error;
          });
     }
     async savePhoto(file, fileName) {
          this.createDir(fileName).then(() => {
               return this.createFile(file, fileName, fileName);
          });
     }

     async saveProfilePhoto(file, path) {
          return fs.writeFile(path, fs.readFileSync(file.path), function (error) {
               if (error) throw error;
          });
     }

     deleteFile(file) {
          fs.rmSync(Path.join(file.url, "../"), { recursive: true }, () => {});
     }
     readPhoto(path) {
          return fs.readFileSync(path);
     }
     exists(path) {
          return fs.existsSync(path);
     }
}

const fileController = new FileController();
module.exports = fileController;
