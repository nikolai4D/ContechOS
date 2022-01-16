const fs = require('fs');

class GraphRecords {
    constructor(nodeGroup) { 
        this.nodeGroup = nodeGroup
    }

    async getAll() {
        const nodes = [];
        const rels = [];
        let nodeType = "";
        let relType = "";

        if (this.nodeGroup === "configs") {
            nodeType = "config"
            relType = "configRel"
        }

        if (this.nodeGroup === "datas") {
            nodeType = "data"
            relType = "dataRel"
        }

        //config = nodes

        const dirNodes = `./db/${nodeType}/`
        const nodeFiles = fs.readdirSync(dirNodes);

        nodeFiles.forEach(function(file) {
        let node = JSON.parse(fs.readFileSync(dirNodes + file, 'utf8'));
        node.id = file.slice(0, -5)
        nodes.push(node);
        })

        //ConfigRel = rels
        const dirRels = `./db/${relType}/`
        const relFiles = fs.readdirSync(dirRels);

        relFiles.forEach(function(file) {
        let rel = JSON.parse(fs.readFileSync(dirRels + file, 'utf8'));
        rel.id = file.slice(0, -5)
        rels.push(rel);
        })

        return { nodes, rels }
    }
}

module.exports = GraphRecords;
