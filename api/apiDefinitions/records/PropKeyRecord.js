const fs = require('fs');
const { v4: uuidv4 } = require('uuid');


class PropKeyRecord {
    constructor() { }

    async create(title, propTypeId) {
        const propKey = {
            "created": Date(),
            "update": Date(),
            "title": title,
            "propTypeId": propTypeId
        };

        const pkId = `pk_${uuidv4()}`;


        fs.writeFileSync(`./db/propKey/${pkId}.json`, JSON.stringify(propKey, null, 2));
        propKey.id = pkId;

        return propKey
    }

    async getAll() {
        const propKeys = [];

        //propKeys

        const dirPropKey = "./db/propKey/"
        const propKeyFiles = fs.readdirSync(dirPropKey);

        propKeyFiles.forEach(function(file) {
        let pk = JSON.parse(fs.readFileSync(dirPropKey + file, 'utf8'));
        pk.id = file.slice(0, -5)
        propKeys.push(pk);
        })


        return propKeys
    }    

   
}




module.exports = new PropKeyRecord();
