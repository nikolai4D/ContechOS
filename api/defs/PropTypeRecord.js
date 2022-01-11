const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class PropTypeRecord {
    constructor() { }

    async create(title) {
        const propType = {
            "created": Date(),
            "update": Date(),
            "title": title
        };

        const ptId = `pt_${uuidv4()}`;


        fs.writeFileSync(`./db/propType/${ptId}.json`, JSON.stringify(propType, null, 2));
        propType.id = ptId;

        return propType
    }
}


module.exports = new PropTypeRecord();
