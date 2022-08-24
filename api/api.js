const express = require("express");
const api = express.Router();
const bodyParser = require("body-parser");
const verifyAccess = require("./middleware/verifyAccess.js");

//----------InitDB----------//

// Bodyparser
// api.use(bodyParser.json());
api.use(
  bodyParser.json({
    limit: "50mb",
  })
);

api.use(
  bodyParser.urlencoded({
    limit: "50mb",
    parameterLimit: 1000000,
    extended: true,
  })
);

//----------auth----------//
api.use("/auth", require("./definitions/auth/auth.js")); //auth
api.use("/register", require("./definitions/auth/register.js")); //auth
api.use("/verify", require("./definitions/auth/verify.js")); //verify
api.use("/refresh", require("./definitions/auth/refresh.js")); //refresh
api.use("/logout", require("./definitions/auth/logout.js")); //logout

//PROTECTED APIs//
api.use(verifyAccess);

//----------definitions----------//
api.use("/definitions", require("./definitions/definitions.js")); //definitions

//----------users----------//
api.use("/user", require("./definitions/users/user.js")); //user
api.use("/roles", require("./definitions/users/roles.js")); //roles

//----------assets----------//
api.use("/assets", require("./definitions/assets/assets.js")); //assets

//----------props----------//
api.use("/propType", require("./definitions/graph/propType.js")); //propType
api.use("/propertyType", require("./definitions/graph/propType.js")); //propType
api.use("/propKey", require("./definitions/graph/propKey.js")); //propKey
api.use("/propertyKey", require("./definitions/graph/propKey.js")); //propKey
api.use("/propVal", require("./definitions/graph/propVal.js")); //propVal
api.use("/propertyValue", require("./definitions/graph/propVal.js")); //propVal

//----------config----------//
//api.use("/configDef", require("./definitions/apiConfigDef.js")); //configDef

api.use("/configDef", require("./definitions/graph/configDef.js")); //configDef
api.use("/definition", require("./definitions/graph/configDef.js")); //configDef with displayname

api.use(
  "/configDefInternalRel",
  require("./definitions/graph/configDefInternalRel.js")
); //configDefInternalRel
api.use(
  "/definitionInternalRel",
  require("./definitions/graph/configDefInternalRel.js")
); //configDefInternalRel
api.use(
  "/configDefExternalRel",
  require("./definitions/graph/configDefExternalRel.js")
); //configDefExternalRel
api.use(
  "/definitionExternalRel",
  require("./definitions/graph/configDefExternalRel.js")
); //configDefExternalRel
api.use("/configObj", require("./definitions/graph/configObj.js")); //configObj
api.use("/object", require("./definitions/graph/configObj.js")); //configObj
api.use(
  "/configObjInternalRel",
  require("./definitions/graph/configObjInternalRel.js")
); //configObjInternalRel
api.use(
  "/objectInternalRel",
  require("./definitions/graph/configObjInternalRel.js")
); //configObjInternalRel
api.use(
  "/configObjExternalRel",
  require("./definitions/graph/configObjExternalRel.js")
); //configObjExternalRel
api.use(
  "/objectExternalRel",
  require("./definitions/graph/configObjExternalRel.js")
); //configObjExternalRel

//----------data----------//
api.use("/typeData", require("./definitions/graph/typeData.js")); //typeData
api.use("/type", require("./definitions/graph/typeData.js")); //typeData
api.use(
  "/typeDataInternalRel",
  require("./definitions/graph/typeDataInternalRel.js")
); //typeDataInternalRel
api.use(
  "/typeInternalRel",
  require("./definitions/graph/typeDataInternalRel.js")
); //typeDataInternalRel
api.use(
  "/typeDataExternalRel",
  require("./definitions/graph/typeDataExternalRel.js")
); //typeDataExternalRel
api.use(
  "/typeExternalRel",
  require("./definitions/graph/typeDataExternalRel.js")
); //typeDataExternalRel
api.use("/instanceData", require("./definitions/graph/instanceData.js")); //instanceData
api.use("/instance", require("./definitions/graph/instanceData.js")); //instanceData
api.use(
  "/instanceDataInternalRel",
  require("./definitions/graph/instanceDataInternalRel.js")
); //instanceDataInternalRel
api.use(
  "/instanceInternalRel",
  require("./definitions/graph/instanceDataInternalRel.js")
); //instanceDataInternalRel
api.use(
  "/instanceDataExternalRel",
  require("./definitions/graph/instanceDataExternalRel.js")
); //instanceDataExternalRel
api.use(
  "/instanceExternalRel",
  require("./definitions/graph/instanceDataExternalRel.js")
); //instanceDataExternalRel

//----------views----------//
//props >>> gets propTypes and propKeys as nodes and rels
api.use("/props", require("./definitions/graphView/graphProps.js"));

//configs >>> gets config and configRel as nodes and rels
api.use("/configs", require("./definitions/graphView/graphConfigs.js"));

//datas >>> gets data and dataRel as nodes and rels
api.use("/datas", require("./definitions/graphView/graphDatas.js"));

api.use("/cypher", require("./cypher/router.js"))

module.exports = api;
