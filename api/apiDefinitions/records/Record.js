const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const apiDefs = require("../apiDefinitions.json")

class Record {
    constructor(nodeType) { 
        this.nodeType = nodeType
    }

    async create(title) {
        const idAbbr = apiDefs.nodeTypes.find(obj => obj.title === this.nodeType).abbr

        const node = {
            "created": Date(),
            "update": Date(),
            "title": title
        };

        const nodeId = `${idAbbr}_${uuidv4()}`;


        fs.writeFileSync(`./db/${this.nodeType}/${nodeId}.json`, JSON.stringify(node, null, 2));
        node.id = nodeId;

        return node
    }

    async getById(id) {
        const node = JSON.parse(fs.readFileSync(`./db/${this.nodeType}/${id}.json`, 'utf8'))
        node.id = id
        return node
    }    

    async getAll() {
        const nodes = [];

        //nodes

        const dir = `./db/${this.nodeType}/`
        const nodeFiles = fs.readdirSync(dir);

        nodeFiles.forEach(function(file) {
        let node = JSON.parse(fs.readFileSync(dir + file, 'utf8'));
        node.id = file.slice(0, -5)
        nodes.push(node);
        })


        return nodes
    }    

    async getAllId() {
        const nodes = [];

        //propTypes

        const dir = `./db/${this.nodeType}/`
        const nodeFiles = fs.readdirSync(dir);

        nodeFiles.forEach(function(file) {
        let nodeId = file.slice(0, -5)
        nodes.push(nodeId);
        })


        return nodes
    }  
}


module.exports = Record;
