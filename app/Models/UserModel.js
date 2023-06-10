class UserModel {
     id;
     name;
     lastName;
     email;
     password;
     verified;
     token;
     photos;

     constructor(_name, _lastname, _email, _passwd, _token) {
          this.id = Date.now();
          this.name = _name;
          this.lastName = _lastname;
          this.email = _email;
          this.password = _passwd;
          this.verified = false;
          this.token = _token;
          this.photos = [];
     }
     giveNewToken = (_token) => {
          this.token = _token;
     };
     verify = () => {
          this.verified = true;
     };
     changeName(_name, _lastname) {
          this.name = _name;
          this.lastName = _lastname;
     }
}

module.exports = UserModel;
