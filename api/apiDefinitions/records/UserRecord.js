const fs = require('fs');
const { v4: uuidv4 } = require('uuid');


class UserRecord {
    constructor() { 
    }

    async create(reqBody) {
        const { email, hashedPwd } = reqBody

        let userId = `u_${uuidv4()}`;

        const user = {
            "created": Date(),
            "updated": Date(),
            "email": email,
            "hashedPwd": hashedPwd
        };

        fs.writeFileSync(`./db/users/${userId}.json`, JSON.stringify(user, null, 2));
        user.id = userId;

        return user
    }

    async getById(id) {
        //user id
        const user = JSON.parse(fs.readFileSync(`./db/users/${id}.json`, 'utf8'))
        user.id = id
        return user
    }    

    async getAll() {
        const users = [];

        //users
        const dir = `./db/users/`
        const userFiles = fs.readdirSync(dir);

        userFiles.forEach(function(file) {
        let user = JSON.parse(fs.readFileSync(dir + file, 'utf8'));
        user.id = file.slice(0, -5)
        users.push(user);
        })

        return users
    }    

    async getAllId() {
        const userIds = [];

        //all users Ids
        const dir = `./db/users/`
        const userFiles = fs.readdirSync(dir);

        userFiles.forEach(function(file) {
        let userId = file.slice(0, -5)
        userIds.push(userId);
        
        })


        return userIds
    }  
}


module.exports = UserRecord;
