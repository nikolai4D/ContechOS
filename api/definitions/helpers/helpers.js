const create = require("./create.js");
const createBulk = require("./createBulk.js");
const createBulkRel = require("./createBulkRel.js");
const idExist = require("./idExist.js");
const ifIsSourceThenDeleteRels = require("./ifIsSourceThenDeleteRels.js");
const isNotEqual = require("./isNotEqual.js");
const isParent = require("./isParent.js");
const isParentIdValid = require("./isParentIdValid.js");
const isTarget = require("./isTarget.js");
const parentIdExist = require("./parentIdExist.js");
const propKeysExist = require("./propKeysExists.js");
const propsExists = require("./propsExists.js");
const readAll = require("./readAll.js");
const readById = require("./readById.js");
const readByLinkToTarget = require("./readByLinkToTarget.js");
const readByParentId = require("./readByParentId.js");
const readSourcesToTarget = require("./readSourcesToTarget.js");
const remove = require("./remove.js");
const reqBodyExists = require("./reqBodyExists.js");
const reqParamExists = require("./reqParamExists.js");
const reqQueryExists = require("./reqQueryExists.js");

const helpers = {
  create,
  createBulk,
  createBulkRel,
  idExist,
  ifIsSourceThenDeleteRels,
  isNotEqual,
  isParent,
  isParentIdValid,
  isTarget,
  parentIdExist,
  propKeysExist,
  propsExists,
  readAll,
  readById,
  readByLinkToTarget,
  readByParentId,
  readSourcesToTarget,
  remove,
  reqBodyExists,
  reqParamExists,
  reqQueryExists,
};

module.exports = helpers;
