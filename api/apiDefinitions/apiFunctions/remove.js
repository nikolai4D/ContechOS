async function remove(routerType, id) {
  const Record = require("../records/Record.js");
  //Record instance
  const record = new Record(routerType);
  let result = { removed: false };

  try {
    let rec = await record.remove(id);
    result.removed = true;
    result.result = await rec;
    return result;
  } catch (error) {
    result.result = error;
    return result;
  }
}

module.exports = remove;
