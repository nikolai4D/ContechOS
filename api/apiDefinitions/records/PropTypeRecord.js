const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class PropTypeRecord {
    constructor() { }

    async create(title) {
        const propType = {
            "created": Date(),
            "update": Date(),
            "title": title
        };

        const ptId = `pt_${uuidv4()}`;


        fs.writeFileSync(`./db/propType/${ptId}.json`, JSON.stringify(propType, null, 2));
        propType.id = ptId;

        return propType
    }

    async getById(id) {
        const propType = JSON.parse(fs.readFileSync(`./db/propType/${id}.json`, 'utf8'))
        propType.id = id
        return propType
    }    

    async getAll() {
        const propTypes = [];

        //propTypes

        const dirPropType = "./db/propType/"
        const propTypeFiles = fs.readdirSync(dirPropType);

        propTypeFiles.forEach(function(file) {
        let pt = JSON.parse(fs.readFileSync(dirPropType + file, 'utf8'));
        pt.id = file.slice(0, -5)
        propTypes.push(pt);
        })


        return propTypes
    }    

    async getAllId() {
        const propTypes = [];

        //propTypes

        const dirPropType = "./db/propType/"
        const propTypeFiles = fs.readdirSync(dirPropType);

        propTypeFiles.forEach(function(file) {
        let ptId = file.slice(0, -5)
        propTypes.push(ptId);
        })


        return propTypes
    }  
}


module.exports = new PropTypeRecord();
