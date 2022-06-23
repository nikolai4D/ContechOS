const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const definitions = JSON.parse(
  fs.readFileSync("./api/definitions/definitions.json", "utf8")
);

// const { nodeTypes, relTypes } = definitions.nodeDefs;

const getNodeTypeArray = definitions.defs.find(
  (obj) => obj.defTitle === "nodeType"
);

let nodeTypes = getNodeTypeArray.defTypes;

nodeTypes.forEach((obj) => {
  obj.defId = getNodeTypeArray.defId;
});

const getRelTypeArray = definitions.defs.find(
  (obj) => obj.defTitle === "relType"
);

let relTypes = getRelTypeArray.defTypes;

relTypes.forEach((obj) => {
  obj.defId = getRelTypeArray.defId;
});

// const relTypes = definitions.defs.find((obj) => obj.defTitle === "relType")
//   .defTypes;

const apiDefsAll = [...nodeTypes, ...relTypes];

// const childDefType = apiDefsAll.find(obj) =>

class Record {
  constructor(defType) {
    this.defType = defType;
  }

  //CREATE

  async create(reqBody) {
    const thisDefType = this.defType;
    const {
      title,
      propKeys,
      parentId,
      source,
      target,
      props,
      typeDataPropKeys,
      instanceDataPropKeys,
      typeDataRelPropKeys,
      instanceDataRelPropKeys,
    } = reqBody;

    const idAbbr = apiDefsAll.find(
      (obj) => obj.defTypeTitle === this.defType
    ).abbr;

    let defTypeId = `${idAbbr}_${uuidv4()}`;

    const defType = {
      created: Date(),
      updated: Date(),
      title: title,
    };
    if (this.defType === "propType") {
    }

    if (this.defType === "propKey") {
      defType.parentId = parentId;
    }

    if (this.defType === "propVal") {
      defType.parentId = parentId;
    }

    if (this.defType === "configDef") {
      defType.propKeys = propKeys;
    }

    if (this.defType === "configDefInternalRel") {
      defType.source = source;
      defType.target = source;
      defTypeId = `${defTypeId}-${source}-${source}`;
      defType.propKeys = propKeys;
    }

    if (this.defType === "configDefExternalRel") {
      defType.source = source;
      defType.target = target;
      defTypeId = `${defTypeId}-${source}-${target}`;
      defType.propKeys = propKeys;
    }

    if (this.defType === "configObj") {
      defType.parentId = parentId;
      defType.props = props;
      defType.typeDataPropKeys = typeDataPropKeys;
      defType.instanceDataPropKeys = instanceDataPropKeys;
    }

    if (this.defType === "configObjInternalRel") {
      defType.parentId = parentId;
      defType.source = source;
      defType.target = target;
      defTypeId = `${defTypeId}-${source}-${target}`;
      defType.props = props;
      defType.typeDataRelPropKeys = typeDataRelPropKeys;
      defType.instanceDataRelPropKeys = instanceDataRelPropKeys;
    }

    if (this.defType === "configObjExternalRel") {
      defType.source = source;
      defType.target = target;
      defTypeId = `${defTypeId}-${source}-${target}`;
      defType.parentId = parentId;
      defType.props = props;
      defType.typeDataRelPropKeys = typeDataRelPropKeys;
      defType.instanceDataRelPropKeys = instanceDataRelPropKeys;
    }

    if (this.defType === "typeData") {
      defType.parentId = parentId;
      defType.props = props;
    }

    if (this.defType === "typeDataInternalRel") {
      defType.parentId = parentId;
      defType.source = source;
      defType.target = target;
      defTypeId = `${defTypeId}-${source}-${target}`;
      defType.props = props;
    }

    if (this.defType === "typeDataExternalRel") {
      defType.parentId = parentId;
      defType.source = source;
      defType.target = target;
      defTypeId = `${defTypeId}-${source}-${target}`;
      defType.props = props;
    }

    if (this.defType === "instanceData") {
      defType.parentId = parentId;
      defType.props = props;
    }

    if (this.defType === "instanceDataInternalRel") {
      defType.parentId = parentId;
      defType.source = source;
      defType.target = target;
      defTypeId = `${defTypeId}-${source}-${target}`;
      defType.props = props;
    }

    if (this.defType === "instanceDataExternalRel") {
      defType.parentId = parentId;
      defType.source = source;
      defType.target = target;
      defTypeId = `${defTypeId}-${source}-${target}`;
      defType.props = props;
    }

    console.log(`../db/${this.defType}/${defTypeId}.json`)

    fs.writeFileSync(
      `../db/${this.defType}/${defTypeId}.json`,
      JSON.stringify(defType, null, 2)
    );
    defType.id = defTypeId;
    defType.type = thisDefType;

    return defType;
  }

  //READ

  async getById(id) {
    //defType id
    const defType = JSON.parse(
      fs.readFileSync(`../db/${this.defType}/${id}.json`, "utf8")
    );
    defType.id = id;
    return defType;
  }

  async getByProp(propKey, propVal) {
    const defTypes = [];

    //defTypes
    const dir = `../db/${this.defType}/`;
    const defTypeFiles = fs.readdirSync(dir);

    defTypeFiles.forEach(function (file) {
      let defType = JSON.parse(fs.readFileSync(dir + file, "utf8"));
      if (defType[propKey] === propVal) {
        defType.created;
        defType.updated;
        defType.id = file.slice(0, -5);
        defTypes.push(defType);
      }
    });

    return defTypes;
  }

  async getByTitle(title) {
    const defTypes = [];

    //defTypes
    const dir = `../db/${this.defType}/`;
    const defTypeFiles = fs.readdirSync(dir);

    defTypeFiles.forEach(function (file) {
      let defType = JSON.parse(fs.readFileSync(dir + file, "utf8"));
      if (defType.title === title) {
        defType.created;
        defType.updated;
        defType.id = file.slice(0, -5);
        defTypes.push(defType);
      }
    });

    return defTypes;
  }

  async getByParentId(parentId) {
    const defTypes = [];

    //defTypes
    const thisDefType = this.defType;
    const dir = `../db/${thisDefType}/`;
    const defTypeFiles = fs.readdirSync(dir);

    defTypeFiles.forEach(function (file) {
      let defType = JSON.parse(fs.readFileSync(dir + file, "utf8"));
      if (defType.parentId === parentId) {
        defType.created;
        defType.updated;
        defType.id = file.slice(0, -5);
        defType.type = thisDefType;
        defTypes.push(defType);
      }
    });

    return defTypes;
  }

  async readRelBySourceAndTarget(sourceId, targetId) {
    const rels = [];
    //get links

    const dirRel = `../db/${this.defType}/`;
    const files = fs.readdirSync(dirRel);

    files.forEach(function (file) {
      let readFile = JSON.parse(fs.readFileSync(dirRel + file, "utf8"));

      if (readFile.target === targetId && readFile.source === sourceId) {
        readFile.id = file.slice(0, -5);
        rels.push(readFile);
      }
    });

    return rels;
  }

  async readByLinkToTarget(linkParentId, targetId) {
    //declare constants
    const thisDefType = this.defType;
    const sources = [];

    //get target
    const target = JSON.parse(
      fs.readFileSync(`../db/${this.defType}/${targetId}.json`, "utf8")
    );
    target.id = targetId;
    target.type = thisDefType;

    //get external and internal links

    const dirExternalRel = `../db/${this.defType}ExternalRel/`;
    const dirInternalRel = `../db/${this.defType}InternalRel/`;
    const externalFiles = fs.readdirSync(dirExternalRel);
    const internalFiles = fs.readdirSync(dirInternalRel);

    externalFiles.forEach(function (file) {
      let externalFile = JSON.parse(
        fs.readFileSync(dirExternalRel + file, "utf8")
      );

      if (
        externalFile.target === targetId &&
        externalFile.parentId === linkParentId
      ) {
        const source = JSON.parse(
          fs.readFileSync(
            `../db/${thisDefType}/${externalFile.source}.json`,
            "utf8"
          )
        );
        source.id = externalFile.source;
        source.type = thisDefType;
        sources.push(source);
      }
    });

    internalFiles.forEach(function (file) {
      let internalFile = JSON.parse(
        fs.readFileSync(dirInternalRel + file, "utf8")
      );

      if (
        internalFile.target === targetId &&
        internalFile.parentId === linkParentId
      ) {
        const source = JSON.parse(
          fs.readFileSync(
            `../db/${thisDefType}/${internalFile.source}.json`,
            "utf8"
          )
        );
        source.id = internalFile.source;
        source.type = thisDefType;
        sources.push(source);
      }
    });

    const result = {
      target: target,
      sources: sources,
    };

    return result;
  }
  async readSourcesToTarget(targetId) {
    //declare constants
    const thisDefType = this.defType;
    const links = [];

    //get target
    const target = JSON.parse(
      fs.readFileSync(`../db/${this.defType}/${targetId}.json`, "utf8")
    );
    target.id = targetId;
    target.type = thisDefType;

    //get external and internal links

    const dirExternalRel = `../db/${this.defType}ExternalRel/`;
    const dirInternalRel = `../db/${this.defType}InternalRel/`;
    const externalFiles = fs.readdirSync(dirExternalRel);
    const internalFiles = fs.readdirSync(dirInternalRel);

    externalFiles.forEach(function (file) {
      let externalFile = JSON.parse(
        fs.readFileSync(dirExternalRel + file, "utf8")
      );

      if (externalFile.target === targetId) {
        let externalFileParentIdInLinks = links.find(
          (obj) => obj.linkParentId === externalFile.parentId
        );
        if (!externalFileParentIdInLinks) {
          links.push({ linkParentId: externalFile.parentId });
          externalFileParentIdInLinks = links.find(
            (obj) => obj.linkParentId === externalFile.parentId
          );
          externalFileParentIdInLinks.sources = [];
        }

        const source = JSON.parse(
          fs.readFileSync(
            `../db/${thisDefType}/${externalFile.source}.json`,
            "utf8"
          )
        );
        source.id = externalFile.source;
        source.type = thisDefType;
        externalFileParentIdInLinks.sources.push(source);
      }
    });

    internalFiles.forEach(function (file) {
      let internalFile = JSON.parse(
        fs.readFileSync(dirInternalRel + file, "utf8")
      );

      if (internalFile.target === targetId) {
        let internalFileParentIdInLinks = links.find(
          (obj) => obj.linkParentId === internalFile.parentId
        );
        if (!internalFileParentIdInLinks) {
          links.push({ linkParentId: internalFile.parentId });
          internalFileParentIdInLinks = links.find(
            (obj) => obj.linkParentId === internalFile.parentId
          );
          internalFileParentIdInLinks.sources = [];
        }

        const source = JSON.parse(
          fs.readFileSync(
            `../db/${thisDefType}/${internalFile.source}.json`,
            "utf8"
          )
        );
        source.id = internalFile.source;
        source.type = thisDefType;
        internalFileParentIdInLinks.sources.push(source);
      }
    });

    const result = {
      target: target,
      links: links,
    };

    return result;
  }

  async getAll() {
    const defTypes = [];

    //defTypes
    const thisDefType = this.defType;
    const dir = `../db/${thisDefType}/`;
    const defTypeFiles = fs.readdirSync(dir);

    defTypeFiles.forEach(function (file) {
      let defType = JSON.parse(fs.readFileSync(dir + file, "utf8"));
      defType.created;
      defType.updated;
      defType.id = file.slice(0, -5);
      defType.type = thisDefType;
      defTypes.push(defType);
    });

    return defTypes;
  }

  getAllId() {
    const defTypes = [];

    //all defTypes Ids
    const dir = `../db/${this.defType}/`;
    const defTypeFiles = fs.readdirSync(dir);

    defTypeFiles.forEach(function (file) {
      let defTypeId = file.slice(0, -5);
      defTypes.push(defTypeId);
    });

    return defTypes;
  }
  isTarget(id) {
    const foundTargets = [];

    //all defTypes Ids
    const dirExternalRel = `../db/${this.defType}ExternalRel/`;
    const dirInternalRel = `../db/${this.defType}InternalRel/`;
    const externalFiles = fs.readdirSync(dirExternalRel);
    const internalFiles = fs.readdirSync(dirInternalRel);

    externalFiles.forEach(function (file) {
      let externalFile = JSON.parse(
        fs.readFileSync(dirExternalRel + file, "utf8")
      );

      if (externalFile.target === id) {
        externalFile.id = file.slice(0, -5);
        foundTargets.push(externalFile.id);
      }
    });

    internalFiles.forEach(function (file) {
      let internalFile = JSON.parse(
        fs.readFileSync(dirInternalRel + file, "utf8")
      );

      if (internalFile.target === id) {
        internalFile.id = file.slice(0, -5);
        foundTargets.push(internalFile.id);
      }
    });

    return foundTargets;
  }

  ifIsSourceThenDeleteRels(id) {
    const deletedRels = [];

    //all defTypes Ids
    const dirExternalRel = `../db/${this.defType}ExternalRel/`;
    const dirInternalRel = `../db/${this.defType}InternalRel/`;
    const externalFiles = fs.readdirSync(dirExternalRel);
    const internalFiles = fs.readdirSync(dirInternalRel);

    externalFiles.forEach(function (file) {
      let externalFile = JSON.parse(
        fs.readFileSync(dirExternalRel + file, "utf8")
      );

      if (externalFile.source === id) {
        deletedRels.push(externalFile.id);
        fs.unlinkSync(dirExternalRel + file);
      }
    });

    internalFiles.forEach(function (file) {
      let internalFile = JSON.parse(
        fs.readFileSync(dirInternalRel + file, "utf8")
      );

      if (internalFile.source === id) {
        deletedRels.push(internalFile.id);
        fs.unlinkSync(dirInternalRel + file);
      }
    });

    return deletedRels;
  }

  isParent(id) {
    let foundChildren = [];
    let parents = [];
    const parentDefType = apiDefsAll.find(
      (obj) => obj.defTypeTitle === this.defType
    );

    const parentDefTypeId = parentDefType.defTypeId;
    const parentDefId = parentDefType.defId;

    apiDefsAll.forEach((obj) => {
      obj.attributes.forEach((el) => {
        if (Object.keys(el).includes("parentId")) {
          if (
            el.parentId.defTypeId === parentDefTypeId &&
            el.parentId.defId === parentDefId
          ) {
            parents.push(obj.defTypeTitle);
          }
        }
      });
    });

    parents.forEach((parent) => {
      const dirChild = `../db/${parent}/`;
      const childFiles = fs.readdirSync(dirChild);

      childFiles.forEach(function (file) {
        let childFile = JSON.parse(fs.readFileSync(dirChild + file, "utf8"));

        if (childFile.parentId === id) {
          childFile.id = file.slice(0, -5);
          foundChildren.push(childFile.id);
        }
      });
    });
    return foundChildren;
  }

  parentIdExist(parentId) {
    let parentIds = {};
    let foundParentId = false;
    apiDefsAll.forEach((obj) => {
      if (obj.defTypeTitle === this.defType) {
        obj.attributes.forEach((el) => {
          if (Object.keys(el).includes("parentId")) {
            parentIds.defId = el.parentId.defId;
            parentIds.defTypeId = el.parentId.defTypeId;
          }
        });
      }
    });

    const parentTitle = apiDefsAll.find(
      (obj) =>
        obj.defId === parentIds.defId && obj.defTypeId === parentIds.defTypeId
    ).defTypeTitle;

    const parentDir = `../db/${parentTitle}/`;
    const parentFiles = fs.readdirSync(parentDir);

    parentFiles.forEach(function (file) {
      let parsedParentId = file.slice(0, -5);
      if (parsedParentId === parentId) {
        foundParentId = true;
      }
    });

    return foundParentId;
  }

  isParentIdValid(parentId, source, target) {
    //get defs for source, target, parentId
    let sourceIds = {};
    let targetIds = {};
    let parentIds = {};
    apiDefsAll.forEach((obj) => {
      if (obj.defTypeTitle === this.defType) {
        obj.attributes.forEach((el) => {
          if (Object.keys(el).includes("source")) {
            sourceIds.defId = el.source.defId;
            sourceIds.defTypeId = el.source.defTypeId;
          }
          if (Object.keys(el).includes("target")) {
            targetIds.defId = el.target.defId;
            targetIds.defTypeId = el.target.defTypeId;
          }
          if (Object.keys(el).includes("parentId")) {
            parentIds.defId = el.parentId.defId;
            parentIds.defTypeId = el.parentId.defTypeId;
          }
        });
      }
    });
    //get parentIds for source and target

    //sourceParentId
    const sourceTitle = apiDefsAll.find(
      (obj) =>
        obj.defId === sourceIds.defId && obj.defTypeId === sourceIds.defTypeId
    ).defTypeTitle;
    //console.log(sourceTitle, "1");

    const readSource = JSON.parse(
      fs.readFileSync(`../db/${sourceTitle}/${source}.json`, "utf8")
    );

    const sourceParentId = readSource.parentId;

    //targetParentId
    const targetTitle = apiDefsAll.find(
      (obj) =>
        obj.defId === targetIds.defId && obj.defTypeId === targetIds.defTypeId
    ).defTypeTitle;

    const readTarget = JSON.parse(
      fs.readFileSync(`../db/${targetTitle}/${target}.json`, "utf8")
    );
    const targetParentId = readTarget.parentId;

    //targetParentId
    const parentTitle = apiDefsAll.find(
      (obj) =>
        obj.defId === parentIds.defId && obj.defTypeId === parentIds.defTypeId
    ).defTypeTitle;

    const readParent = JSON.parse(
      fs.readFileSync(`../db/${parentTitle}/${parentId}.json`, "utf8")
    );

    const parentSource = readParent.source;
    const parentTarget = readParent.target;

    return { sourceParentId, targetParentId, parentSource, parentTarget };
  }

  getParent(parentId) {
    let parentIds = {};
    apiDefsAll.forEach((obj) => {
      if (obj.defTypeTitle === this.defType) {
        obj.attributes.forEach((el) => {
          if (Object.keys(el).includes("parentId")) {
            parentIds.defId = el.parentId.defId;
            parentIds.defTypeId = el.parentId.defTypeId;
          }
        });
      }
    });
    //targetParentId
    const parentTitle = apiDefsAll.find(
      (obj) =>
        obj.defId === parentIds.defId && obj.defTypeId === parentIds.defTypeId
    ).defTypeTitle;

    let readParent = JSON.parse(
      fs.readFileSync(`../db/${parentTitle}/${parentId}.json`, "utf8")
    );
    readParent.id = parentId;

    return readParent;
  }

  //UPDATE

  async update(reqBody) {
    const thisDefType = this.defType;
    const {
      id,
      title,
      propKeys,
      parentId,
      props,
      typeDataPropKeys,
      instanceDataPropKeys,
      typeDataRelPropKeys,
      instanceDataRelPropKeys,
    } = reqBody;

    const oldFile = await this.getById(id);

    let defTypeId = id;

    const defType = {
      created: oldFile.created,
      updated: Date(),
      title: title,
    };
    if (this.defType === "propType") {
    }

    if (this.defType === "propKey") {
      defType.parentId = parentId;
    }

    if (this.defType === "propVal") {
      defType.parentId = parentId;
    }

    if (this.defType === "configDef") {
      defType.propKeys = propKeys;
    }

    if (this.defType === "configDefInternalRel") {
      defType.source = oldFile.source;
      defType.target = oldFile.target;
      defType.propKeys = propKeys;
    }

    if (this.defType === "configDefExternalRel") {
      defType.source = oldFile.source;
      defType.target = oldFile.target;
      defType.propKeys = propKeys;
    }

    if (this.defType === "configObj") {
      defType.parentId = parentId;
      defType.props = props;
      defType.typeDataPropKeys = typeDataPropKeys;
      defType.instanceDataPropKeys = instanceDataPropKeys;
    }

    if (this.defType === "configObjInternalRel") {
      defType.parentId = parentId;
      defType.source = oldFile.source;
      defType.target = oldFile.target;
      defType.props = props;
      defType.typeDataRelPropKeys = typeDataRelPropKeys;
      defType.instanceDataRelPropKeys = instanceDataRelPropKeys;
    }

    if (this.defType === "configObjExternalRel") {
      defType.source = oldFile.source;
      defType.target = oldFile.target;
      defType.parentId = parentId;
      defType.props = props;
      defType.typeDataRelPropKeys = typeDataRelPropKeys;
      defType.instanceDataRelPropKeys = instanceDataRelPropKeys;
    }

    if (this.defType === "typeData") {
      defType.parentId = parentId;
      defType.props = props;
    }

    if (this.defType === "typeDataInternalRel") {
      defType.parentId = parentId;
      defType.source = oldFile.source;
      defType.target = oldFile.target;
      defType.props = props;
    }

    if (this.defType === "typeDataExternalRel") {
      defType.parentId = parentId;
      defType.source = oldFile.source;
      defType.target = oldFile.target;
      defType.props = props;
    }

    if (this.defType === "instanceData") {
      defType.parentId = parentId;
      defType.props = props;
    }

    if (this.defType === "instanceDataInternalRel") {
      defType.parentId = parentId;
      defType.source = oldFile.source;
      defType.target = oldFile.target;
      defType.props = props;
    }

    if (this.defType === "instanceDataExternalRel") {
      defType.parentId = parentId;
      defType.source = oldFile.source;
      defType.target = oldFile.target;
      defType.props = props;
    }

    fs.writeFileSync(
      `../db/${this.defType}/${defTypeId}.json`,
      JSON.stringify(defType, null, 2)
    );
    defType.id = defTypeId;
    defType.type = thisDefType;

    return defType;
  }

  //DELETE

  remove(id) {
    const dir = `../db/${this.defType}/`;
    const file = id + ".json";
    fs.unlinkSync(dir + file);
    return `removed: ${id}`;
  }
}
module.exports = Record;
