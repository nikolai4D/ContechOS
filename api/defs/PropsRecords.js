const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class PropsRecords {
    constructor() { }

    async getAll() {
        const nodes = [];
        const rels = [];

        const props = {
            nodes,
            rels
        }

        //propTypes

        const dirPropType = "./db/propType/"
        const propTypeFiles = fs.readdirSync(dirPropType);

        propTypeFiles.forEach(function(file) {
        let node = JSON.parse(fs.readFileSync(dirPropType + file, 'utf8'));
        node.id = file.slice(0, -5)
        nodes.push(node);
        })

        //propKeys
        const dirPropKey = "./db/propKey/"
        const propKeyFiles = fs.readdirSync(dirPropKey);

        propKeyFiles.forEach(function(file) {
        let node = JSON.parse(fs.readFileSync(dirPropKey + file, 'utf8'));
        node.id = file.slice(0, -5)
        nodes.push(node);

        let rel = {
            "id":node.id + "_" + node.propType,
            "source":node.id,
            "target":node.propType
        }
        rels.push(rel);    
        })

        return props
    }
}

module.exports = new PropsRecords();
