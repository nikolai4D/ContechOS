async function ifIsSourceThenDeleteRels(routerType, id, res) {
  const Record = require("../records/Record.js");
  const record = new Record(routerType);
  const result = await record.ifIsSourceThenDeleteRels(id);

  if (result.length > 0) {
    console.log(`deleted: ${result}`);
    return true;
  } else {
    return false;
  }
}
module.exports = ifIsSourceThenDeleteRels;
