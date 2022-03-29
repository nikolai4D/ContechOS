async function parentIdExist(routerType, parentId, res) {
  const Record = require("../../records/Record.js");
  const record = new Record(routerType);
  const result = await record.parentIdExist(parentId);

  if (!result) {
    res.status(400).json(`${parentId} is not a valid parentId`);
    return false;
  } else {
    return true;
  }
}

module.exports = parentIdExist;
