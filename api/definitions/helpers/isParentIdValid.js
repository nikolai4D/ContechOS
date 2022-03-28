async function isParentIdValid(routerType, parentId, source, target, res) {
  const Record = require("../../records/Record.js");
  const record = new Record(routerType);
  const result = await record.isParentIdValid(parentId, source, target);

  if (!result.sourceParentId === result.parentSource) {
    res.status(400).json(`${source} is not a valid source`);
    return false;
  } else if (!result.targetParentId === result.parentTarget) {
    res.status(400).json(`${target} is not a valid target`);
    return false;
  } else {
    return true;
  }
}
module.exports = isParentIdValid;
