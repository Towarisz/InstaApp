class UserModel{
    id;
    name;
    lastname;
    email;
    passwd;
    verified;
    token;

    constructor(_name,_lastname,_email,_passwd,_token){
        this.id = Date.now();
        this.name = _name;
        this.lastname = _lastname;
        this.email = _email;
        this.passwd = _passwd;
        this.verified = false;
        this.token = _token;
    }
    giveNewToken = (_token)=> {
        this.token = _token;
    }
    verify = ()=> {
        this.verified = true;
    }
}

module.exports = UserModel;