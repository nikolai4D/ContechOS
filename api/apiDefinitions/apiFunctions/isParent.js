async function isParent(routerType, id, res) {
  const Record = require("../records/Record.js");
  const record = new Record(routerType);
  const result = await record.isParent(id);

  if (result.length > 0) {
    res.status(400).json(`${id} is parent to: ${result}`);
    return false;
  } else {
    return true;
  }
}
module.exports = isParent;
