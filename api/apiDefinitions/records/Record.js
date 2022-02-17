const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const fileNodeDefs = JSON.parse(
  fs.readFileSync("./api/apiDefinitions/definitions.json", "utf8")
);

const { nodeTypes, relTypes } = fileNodeDefs.nodeDefs;

const apiDefsAll = [...nodeTypes, ...relTypes];

class Record {
  constructor(defType) {
    this.defType = defType;
  }

  //CREATE

  async create(reqBody) {
    const {
      title,
      propKeys,
      propTypeId,
      propKeyId,
      source,
      target,
      configDefId,
      configDefInternalRelId,
      configDefExternalRelId,
      props,
      typePropKeys,
      instancePropKeys,
    } = reqBody;

    const idAbbr = apiDefsAll.find((obj) => obj.title === this.defType).abbr;

    let defTypeId = `${idAbbr}_${uuidv4()}`;

    const defType = {
      created: Date(),
      updated: Date(),
      title: title,
    };
    if (this.defType === "propType") {
    }

    if (this.defType === "propKey") {
      defType.propTypeId = propTypeId;
    }

    if (this.defType === "propVal") {
      defType.propKeyId = propKeyId;
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
      defType.configDefId = configDefId;
      defType.props = props;
      defType.typePropKeys = typePropKeys;
      defType.instancePropKeys = instancePropKeys;
    }

    if (this.defType === "configObjInternalRel") {
      defType.source = source;
      defType.target = source;
      defTypeId = `${defTypeId}-${source}-${source}`;
      defType.configDefInternalRelId = configDefInternalRelId;
      defType.props = props;
    }

    if (this.defType === "configObjExternalRel") {
      defType.source = source;
      defType.target = target;
      defTypeId = `${defTypeId}-${source}-${target}`;
      defType.configDefExternalRelId = configDefExternalRelId;
      defType.props = props;
    }

    // if (this.defType === "data") {
    //   defType.configId = configId;
    // }

    // if (this.defType === "dataRel") {
    //   defType.source = source;
    //   defType.target = target;
    //   defType.configRelId = configRelId;
    //   defTypeId = `${defTypeId}-${source}-${target}`;
    // }

    fs.writeFileSync(
      `../db/${this.defType}/${defTypeId}.json`,
      JSON.stringify(defType, null, 2)
    );
    defType.id = defTypeId;

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

    console.log(propKey, propVal);

    //defTypes
    const dir = `../db/${this.defType}/`;
    const defTypeFiles = fs.readdirSync(dir);

    defTypeFiles.forEach(function (file) {
      let defType = JSON.parse(fs.readFileSync(dir + file, "utf8"));
      console.log(defType);
      if (defType[propKey] === propVal) {
        delete defType.created;
        delete defType.updated;
        defType.id = file.slice(0, -5);
        defTypes.push(defType);
      }
    });

    return defTypes;
  }

  async getAll() {
    const defTypes = [];

    //defTypes
    const dir = `../db/${this.defType}/`;
    const defTypeFiles = fs.readdirSync(dir);

    defTypeFiles.forEach(function (file) {
      let defType = JSON.parse(fs.readFileSync(dir + file, "utf8"));
      delete defType.created;
      delete defType.updated;
      defType.id = file.slice(0, -5);
      defTypes.push(defType);
    });

    return defTypes;
  }

  async getAllId() {
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

  //UPDATE

  //DELETE
}

module.exports = Record;
