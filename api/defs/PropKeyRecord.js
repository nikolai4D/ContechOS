const fs = require('fs');
const { v4: uuidv4 } = require('uuid');


class PropKeyRecord {
    constructor() { }

    async create(title, propType) {
        const propKey = {
            "created": Date(),
            "update": Date(),
            "title": title,
            "propType": propType
        };

        const pkId = `pk_${uuidv4()}`;


        fs.writeFileSync(`./db/propKey/${pkId}.json`, JSON.stringify(propKey, null, 2));
        propKey.id = pkId;

        return propKey
    }
}


module.exports = new PropKeyRecord();
