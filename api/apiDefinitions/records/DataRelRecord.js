const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class DataRelRecord {
    constructor() { }

    async create(title, configRelId, source, target) {
        const dataRel = {
            "created": Date(),
            "update": Date(),
            "title": title,
            "configRelId": configRelId,
            "source": source,
            "target": target
        };

        const drId = `dr_${uuidv4()}`;


        fs.writeFileSync(`./db/dataRel/${drId}.json`, JSON.stringify(dataRel, null, 2));
        dataRel.id = drId;

        return dataRel
    }
}


module.exports = new DataRelRecord();
