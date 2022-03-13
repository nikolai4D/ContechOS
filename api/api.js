const express = require("express");
const api = express.Router();
const bodyParser = require("body-parser");
const verifyAccess = require("./middleware/verifyAccess.js");

//----------InitDB----------//

// Bodyparser
api.use(bodyParser.json());

//----------auth----------//
api.use("/auth", require("./apiDefinitions/auth.js")); //auth
api.use("/register", require("./apiDefinitions/register.js")); //auth
api.use("/verify", require("./apiDefinitions/verify.js")); //verify
api.use("/refresh", require("./apiDefinitions/refresh.js")); //refresh
api.use("/logout", require("./apiDefinitions/logout.js")); //logout

//PROTECTED APIs//
api.use(verifyAccess);

//----------definitions----------//
api.use("/definitions", require("./apiDefinitions/apiDefinitions.js")); //definitions

//----------users----------//
api.use("/user", require("./apiDefinitions/user.js")); //user
api.use("/roles", require("./apiDefinitions/roles.js")); //roles
api.use("/assets", require("./apiDefinitions/assets.js")); //assets

//----------props----------//
api.use("/propType", require("./apiDefinitions/apiPropType.js")); //propType
api.use("/propertyType", require("./apiDefinitions/apiPropType.js")); //propType
api.use("/propKey", require("./apiDefinitions/apiPropKey.js")); //propKey
api.use("/propertyKey", require("./apiDefinitions/apiPropKey.js")); //propKey
api.use("/propVal", require("./apiDefinitions/apiPropVal.js")); //propVal
api.use("/propertyValue", require("./apiDefinitions/apiPropVal.js")); //propVal

//props >>> gets propTypes and propKeys as nodes and rels
api.use("/props", require("./apiDefinitions/graphProps.js"));

//----------config----------//
//api.use("/configDef", require("./apiDefinitions/apiConfigDef.js")); //configDef

api.use("/configDef", require("./apiDefinitions/apiConfigDef.js")); //configDef
api.use("/definition", require("./apiDefinitions/apiConfigDef.js")); //configDef with displayname

api.use(
  "/configDefInternalRel",
  require("./apiDefinitions/apiConfigDefInternalRel.js")
); //configDefInternalRel
api.use(
  "/definitionInternalRel",
  require("./apiDefinitions/apiConfigDefInternalRel.js")
); //configDefInternalRel
api.use(
  "/configDefExternalRel",
  require("./apiDefinitions/apiConfigDefExternalRel.js")
); //configDefExternalRel
api.use(
  "/definitionExternalRel",
  require("./apiDefinitions/apiConfigDefExternalRel.js")
); //configDefExternalRel
api.use("/configObj", require("./apiDefinitions/apiConfigObj.js")); //configObj
api.use("/object", require("./apiDefinitions/apiConfigObj.js")); //configObj
api.use(
  "/configObjInternalRel",
  require("./apiDefinitions/apiConfigObjInternalRel.js")
); //configObjInternalRel
api.use(
  "/objectInteralRel",
  require("./apiDefinitions/apiConfigObjInternalRel.js")
); //configObjInternalRel
api.use(
  "/configObjExternalRel",
  require("./apiDefinitions/apiConfigObjExternalRel.js")
); //configObjExternalRel
api.use(
  "/objectExternalRel",
  require("./apiDefinitions/apiConfigObjExternalRel.js")
); //configObjExternalRel

//configs >>> gets config and configRel as nodes and rels
api.use("/configs", require("./apiDefinitions/graphConfigs.js"));

//----------data----------//
api.use("/typeData", require("./apiDefinitions/apiTypeData.js")); //typeData
api.use("/type", require("./apiDefinitions/apiTypeData.js")); //typeData
api.use(
  "/typeDataInternalRel",
  require("./apiDefinitions/apiTypeDataInternalRel.js")
); //typeDataInternalRel
api.use(
  "/typeInternalRel",
  require("./apiDefinitions/apiTypeDataInternalRel.js")
); //typeDataInternalRel
api.use(
  "/typeDataExternalRel",
  require("./apiDefinitions/apiTypeDataExternalRel.js")
); //typeDataExternalRel
api.use(
  "/typeExternalRel",
  require("./apiDefinitions/apiTypeDataExternalRel.js")
); //typeDataExternalRel
api.use("/instanceData", require("./apiDefinitions/apiInstanceData.js")); //instanceData
api.use("/instance", require("./apiDefinitions/apiInstanceData.js")); //instanceData
api.use(
  "/instanceDataInternalRel",
  require("./apiDefinitions/apiInstanceDataInternalRel.js")
); //instanceDataInternalRel
api.use(
  "/instanceInternalRel",
  require("./apiDefinitions/apiInstanceDataInternalRel.js")
); //instanceDataInternalRel
api.use(
  "/instanceDataExternalRel",
  require("./apiDefinitions/apiInstanceDataExternalRel.js")
); //instanceDataExternalRel
api.use(
  "/instanceExternalRel",
  require("./apiDefinitions/apiInstanceDataExternalRel.js")
); //instanceDataExternalRel

//datas >>> gets data and dataRel as nodes and rels
api.use("/datas", require("./apiDefinitions/graphDatas.js"));

module.exports = api;
