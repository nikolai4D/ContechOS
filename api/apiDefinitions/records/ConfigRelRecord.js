const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class ConfigRelRecord {
    constructor() { }

    async create(title,source,target) {
        const configRel = {
            "created": Date(),
            "update": Date(),
            "title": title,
            "source": source,
            "target": target
        };

        const crId = `cr_${uuidv4()}`;


        fs.writeFileSync(`./db/configRel/${crId}.json`, JSON.stringify(configRel, null, 2));
        configRel.id = crId;

        return configRel
    }
}


module.exports = new ConfigRelRecord();
