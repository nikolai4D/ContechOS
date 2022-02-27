async function isTarget(routerType, id) {
  const Record = require("../records/Record.js");
  //Record instance
  const record = new Record(routerType);

  const result = await record.isTarget(id);
  return result;
}

module.exports = isTarget;
