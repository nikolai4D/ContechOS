const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class ConfigRecord {
    constructor() { }

    async create(title) {
        const config = {
            "created": Date(),
            "update": Date(),
            "title": title
        };

        const cId = `c_${uuidv4()}`;


        fs.writeFileSync(`./db/config/${cId}.json`, JSON.stringify(config, null, 2));
        config.id = cId;

        return config
    }
}


module.exports = new ConfigRecord();
