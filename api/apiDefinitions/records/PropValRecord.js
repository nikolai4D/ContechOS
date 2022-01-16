const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class PropValRecord {
    constructor() { }

    async create(title,propKeyId) {
        const propVal = {
            "created": Date(),
            "update": Date(),
            "title": title,
            "propKeyId":propKeyId
        };

        const pvId = `pv_${uuidv4()}`;


        fs.writeFileSync(`./db/propVal/${pvId}.json`, JSON.stringify(propVal, null, 2));
        propVal.id = pvId;

        return propVal
    }
}


module.exports = new PropValRecord();
