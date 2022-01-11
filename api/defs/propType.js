const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

class PropTypeRecord {
    constructor() { }

    async create(type) {
        const propType = {
            "created": Date(),
            "update": Date(),
            "type": type
        };

        const ptId = `pt_${uuidv4()}.json`;


        fs.writeFileSync(`./db/propType/${ptId}`, JSON.stringify(propType, null, 2));
        propType.id = ptId;

        return propType
    }
}


module.exports = new PropTypeRecord();
