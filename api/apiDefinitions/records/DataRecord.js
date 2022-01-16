const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class DataRecord {
    constructor() { }

    async create(title,configId) {
        const data = {
            "created": Date(),
            "update": Date(),
            "title": title,
            "configId": configId
        };

        const dId = `d_${uuidv4()}`;


        fs.writeFileSync(`./db/data/${dId}.json`, JSON.stringify(data, null, 2));
        data.id = dId;

        return data
    }
}


module.exports = new DataRecord();
