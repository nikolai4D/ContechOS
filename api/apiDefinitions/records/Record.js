const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const apiDefs = require("../definitions.json");

class Record {
  constructor(nodeType) {
    this.nodeType = nodeType;
  }

  async create(reqBody) {
    const {
      title,
      propTypeId,
      propKeyId,
      source,
      target,
      configId,
      configRelId,
    } = reqBody;

    const idAbbr = apiDefs.nodeTypes.find((obj) => obj.title === this.nodeType)
      .abbr;

    let nodeId = `${idAbbr}_${uuidv4()}`;

    const node = {
      created: Date(),
      updated: Date(),
      title: title,
    };
    if (this.nodeType === "propType") {
    }

    if (this.nodeType === "propKey") {
      node.propTypeId = propTypeId;
    }

    if (this.nodeType === "propVal") {
      node.propKeyId = propKeyId;
    }

    if (this.nodeType === "config") {
    }

    if (this.nodeType === "configRel") {
      node.source = source;
      node.target = target;
      nodeId = `${nodeId}-${source}-${target}`;
    }

    if (this.nodeType === "data") {
      node.configId = configId;
    }

    if (this.nodeType === "dataRel") {
      node.source = source;
      node.target = target;
      node.configRelId = configRelId;
      nodeId = `${nodeId}-${source}-${target}`;
    }

    fs.writeFileSync(
      `../db/${this.nodeType}/${nodeId}.json`,
      JSON.stringify(node, null, 2)
    );
    node.id = nodeId;

    return node;
  }

  async getById(id) {
    //node id
    const node = JSON.parse(
      fs.readFileSync(`../db/${this.nodeType}/${id}.json`, "utf8")
    );
    node.id = id;
    return node;
  }

  async getAll() {
    const nodes = [];

    //nodes
    const dir = `../db/${this.nodeType}/`;
    const nodeFiles = fs.readdirSync(dir);

    nodeFiles.forEach(function (file) {
      let node = JSON.parse(fs.readFileSync(dir + file, "utf8"));
      delete node.created;
      delete node.updated;
      node.id = file.slice(0, -5);
      nodes.push(node);
    });

    return nodes;
  }

  async getAllId() {
    const nodes = [];

    //all nodes Ids
    const dir = `../db/${this.nodeType}/`;
    const nodeFiles = fs.readdirSync(dir);

    nodeFiles.forEach(function (file) {
      let nodeId = file.slice(0, -5);
      nodes.push(nodeId);
    });

    return nodes;
  }
}

module.exports = Record;
