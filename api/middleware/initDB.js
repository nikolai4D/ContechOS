const fs = require("fs");
const Record = require("../records/UserRecord");
const userRecord = new Record("user");

const initDB = (req, res, next) => {
  const dir = `../db/`;

  //general
  const dirUser = `${dir}users/`;
  const dirRoles = `${dir}roles/`;
  const dirAssets = `${dir}assets/`;

  //props
  const dirPropType = `${dir}propType/`;
  const dirPropKey = `${dir}propKey/`;
  const dirPropVal = `${dir}propVal/`;

  //configs
  const dirConfigDef = `${dir}configDef/`;
  const dirConfigDefInternalRel = `${dir}configDefInternalRel/`;
  const dirconfigDefExternalRel = `${dir}configDefExternalRel/`;
  const dirConfigObj = `${dir}configObj`;
  const dirConfigObjInternalRel = `${dir}configObjInternalRel/`;
  const dirconfigObjExternalRel = `${dir}configObjExternalRel/`;

  //datas
  const dirTypeData = `${dir}typeData/`;
  const dirTypeDataInternalRel = `${dir}typeDataInternalRel/`;
  const dirTypeDataExternalRel = `${dir}typeDataExternalRel/`;
  const dirInstanceData = `${dir}instanceData/`;
  const dirInstanceDataInternalRel = `${dir}instanceDataInternalRel/`;
  const dirInstanceDataExternalRel = `${dir}instanceDataExternalRel/`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(`${dir}`, false);
    fs.writeFileSync(`${dir}.gitignore`, "*");

    //general
    if (!fs.existsSync(dirUser)) {
      fs.mkdirSync(dirUser, false);
    }
    if (!fs.existsSync(dirRoles)) {
      fs.mkdirSync(dirRoles, false);
    }
    if (!fs.existsSync(dirAssets)) {
      fs.mkdirSync(dirAssets, false);
    }
    //props
    if (!fs.existsSync(dirPropType)) {
      fs.mkdirSync(dirPropType, false);
    }
    if (!fs.existsSync(dirPropKey)) {
      fs.mkdirSync(dirPropKey, false);
    }
    if (!fs.existsSync(dirPropVal)) {
      fs.mkdirSync(dirPropVal, false);
    }
    //configs
    if (!fs.existsSync(dirConfigDef)) {
      fs.mkdirSync(dirConfigDef, false);
    }
    if (!fs.existsSync(dirConfigDefInternalRel)) {
      fs.mkdirSync(dirConfigDefInternalRel, false);
    }
    if (!fs.existsSync(dirconfigDefExternalRel)) {
      fs.mkdirSync(dirconfigDefExternalRel, false);
    }
    if (!fs.existsSync(dirConfigObj)) {
      fs.mkdirSync(dirConfigObj, false);
    }
    if (!fs.existsSync(dirConfigObjInternalRel)) {
      fs.mkdirSync(dirConfigObjInternalRel, false);
    }
    if (!fs.existsSync(dirconfigObjExternalRel)) {
      fs.mkdirSync(dirconfigObjExternalRel, false);
    }
    //datas
    if (!fs.existsSync(dirTypeData)) {
      fs.mkdirSync(dirTypeData, false);
    }
    if (!fs.existsSync(dirTypeDataInternalRel)) {
      fs.mkdirSync(dirTypeDataInternalRel, false);
    }
    if (!fs.existsSync(dirTypeDataExternalRel)) {
      fs.mkdirSync(dirTypeDataExternalRel, false);
    }
    if (!fs.existsSync(dirInstanceData)) {
      fs.mkdirSync(dirInstanceData, false);
    }
    if (!fs.existsSync(dirInstanceDataInternalRel)) {
      fs.mkdirSync(dirInstanceDataInternalRel, false);
    }
    if (!fs.existsSync(dirInstanceDataExternalRel)) {
      fs.mkdirSync(dirInstanceDataExternalRel, false);
    }

    try {
      result = userRecord.create({ createAdmin: true });
    } catch (error) {
      console.log(error);
    }
  }
  next();
};

module.exports = initDB;
