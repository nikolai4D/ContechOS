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

    if (this.nodeGroup === "configs") {
      nodeTypes = ["configDef", "configObj"];
      relTypes = [
        "configDefInternalRel",
        "configDefExternalRel",
        "configObjInternalRel",
        "configObjExternalRel",
      ];
    }

    if (this.nodeGroup === "datas") {
      nodeTypes = ["typeData", "instanceData"];
      relTypes = [
        "typeDataInternalRel",
        "typeDataExternalRel",
        "instanceDataInternalRel",
        "instanceDataExternalRel",
      ];
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
        if (node.parentId && nodeType !== "typeData") {
          let rel = {};
          rel.title = "has parent";
          rel.source = node.id;
          rel.target = node.parentId;
          rel.id = rel.source + "-" + rel.target;
          rels.push(rel);
        }
        node.defTypeTitle = nodeType;
        node.defType = nodeType;

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
          rel.defTypeTitle = relType;
          rel.defType = relType;

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
          if (rel.parentId) {
            parentId = rel.parentId;
            rel.title = "has parent";
          }

          let nodeId = file.slice(0, -5);
          rel.id = nodeId + parentId;
          rel.source = nodeId;
          rel.target = parentId;

          rels.push(rel);
        });
      });
    }

    return { nodes, rels };
  }
}

module.exports = GraphRecords;
