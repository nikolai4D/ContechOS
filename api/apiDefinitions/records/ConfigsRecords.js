const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class ConfigsRecords {
    constructor() { }

    async getAll() {
        const nodes = [];
        const rels = [];

        const configs = {
            nodes,
            rels
        }

        //config = nodes

        const dirConfig = "./db/config/"
        const configFiles = fs.readdirSync(dirConfig);

        configFiles.forEach(function(file) {
        let node = JSON.parse(fs.readFileSync(dirConfig + file, 'utf8'));
        node.id = file.slice(0, -5)
        nodes.push(node);
        })

        //ConfigRel = rels
        const dirConfigRel = "./db/configRel/"
        const configRelFiles = fs.readdirSync(dirConfigRel);

        configRelFiles.forEach(function(file) {
        let rel = JSON.parse(fs.readFileSync(dirConfigRel + file, 'utf8'));
        rel.id = file.slice(0, -5)
        rels.push(rel);
        })

        return configs
    }
}

module.exports = new ConfigsRecords();
