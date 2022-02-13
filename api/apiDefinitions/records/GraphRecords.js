const fs = require("fs");

class GraphRecords {
  constructor(nodeGroup) {
    this.nodeGroup = nodeGroup;
  }

  async getAll() {
    const nodes = [];
    const rels = [];
    let nodeType = "";
    let relType = "";

    if (this.nodeGroup === "configs") {
      nodeType = "configDef";
      relType = "configRel";
    }

    if (this.nodeGroup === "datas") {
      nodeType = "data";
      relType = "dataRel";
    }

    if (this.nodeGroup === "props") {
      nodeType = "propType";
      relType = "propKey";
    }

    //Nodes

    const dirNodes = `../db/${nodeType}/`;
    const nodeFiles = fs.readdirSync(dirNodes);

    nodeFiles.forEach(function (file) {
      let node = JSON.parse(fs.readFileSync(dirNodes + file, "utf8"));
      delete node.created;
      delete node.updated;
      node.id = file.slice(0, -5);
      nodes.push(node);
    });

    //Rels
    if (this.nodeGroup != "props") {
      const dirRels = `../db/${relType}/`;
      const relFiles = fs.readdirSync(dirRels);

      relFiles.forEach(function (file) {
        let rel = JSON.parse(fs.readFileSync(dirRels + file, "utf8"));
        delete rel.created;
        delete rel.updated;
        rel.id = file.slice(0, -5);
        rels.push(rel);
      });
    } else {
      const dirRels = `../db/${relType}/`;
      const relFiles = fs.readdirSync(dirRels);

      relFiles.forEach(function (file) {
        let node = JSON.parse(fs.readFileSync(dirRels + file, "utf8"));
        delete node.created;
        delete node.updated;
        node.id = file.slice(0, -5);

        nodes.push(node);

        let rel = {
          id: node.id + "_" + node.propTypeId,
          source: node.id,
          target: node.propTypeId,
          title: "has propType",
        };
        rels.push(rel);
      });
    }

    return { nodes, rels };
  }
}

module.exports = GraphRecords;
