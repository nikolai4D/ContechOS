const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class DatasRecords {
    constructor() { }

    async getAll() {
        const nodes = [];
        const rels = [];

        const datas = {
            nodes,
            rels
        }

        //Data = nodes

        const dirData = "./db/data/"
        const dataFiles = fs.readdirSync(dirData);

        dataFiles.forEach(function(file) {
        let node = JSON.parse(fs.readFileSync(dirData + file, 'utf8'));
        node.id = file.slice(0, -5)
        nodes.push(node);
        })

        //DataRel = rels
        const dirDataRel = "./db/dataRel/"
        const dataRelFiles = fs.readdirSync(dirDataRel);

        dataRelFiles.forEach(function(file) {
        let rel = JSON.parse(fs.readFileSync(dirDataRel + file, 'utf8'));
        rel.id = file.slice(0, -5)
        rels.push(rel);
        })

        return datas
    }
}

module.exports = new DatasRecords();
