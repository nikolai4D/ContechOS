const fs = require("fs");

class GraphRecords {
  constructor(nodeGroup) {
    this.nodeGroup = nodeGroup;
  }

  async getAll() {
    const nodes = [];
    const rels = [];
    let nodeTypes = [];
    let relTypes = [];
    // let nodeType = "";
    // let relType = "";

    // if (this.nodeGroup === "configs") {
    //   nodeType = "configDef";
    //   relType = "configDefInternalRel";
    // }

    if (this.nodeGroup === "configs") {
      nodeTypes = ["configDef"];
      relTypes = ["configDefInternalRel", "configDefExternalRel"];
    }

    if (this.nodeGroup === "datas") {
      nodeTypes = ["data"];
      relTypes = ["dataRel"];
    }

    if (this.nodeGroup === "props") {
      nodeTypes = ["propType", "propKey", "propVal"];
      relTypes = ["propKey", "propVal"];
    }

    //Nodes

    nodeTypes.forEach((nodeType) => {
      const dirNodes = `../db/${nodeType}/`;
      const nodeFiles = fs.readdirSync(dirNodes);

      nodeFiles.forEach(function (file) {
        let node = JSON.parse(fs.readFileSync(dirNodes + file, "utf8"));
        delete node.created;
        delete node.updated;
        node.id = file.slice(0, -5);
        node.nodeType = nodeType;
        nodes.push(node);
      });
    });

    //Rels
    if (this.nodeGroup != "props") {
      relTypes.forEach((relType) => {
        const dirRels = `../db/${relType}/`;
        const relFiles = fs.readdirSync(dirRels);

        relFiles.forEach(function (file) {
          let rel = JSON.parse(fs.readFileSync(dirRels + file, "utf8"));

          delete rel.created;
          delete rel.updated;
          rel.id = file.slice(0, -5);
          rels.push(rel);
        });
      });
    } else {
      relTypes.forEach((relType) => {
        const dirRels = `../db/${relType}/`;
        const relFiles = fs.readdirSync(dirRels);

        relFiles.forEach(function (file) {
          let parentId = "";
          let rel = JSON.parse(fs.readFileSync(dirRels + file, "utf8"));
          delete rel.created;
          delete rel.updated;
          if (rel.propTypeId) {
            parentId = rel.propTypeId;
            rel.title = "has propType";
          }
          if (rel.propKeyId) {
            parentId = rel.propKeyId;
            rel.title = "has propKey";
          }
          let nodeId = file.slice(0, -5);
          rel.id = nodeId + parentId;
          rel.source = nodeId;
          rel.target = parentId;

          rels.push(rel);
        });
      });
    }
    console.log({ nodes, rels });
    return { nodes, rels };
  }
}

module.exports = GraphRecords;
