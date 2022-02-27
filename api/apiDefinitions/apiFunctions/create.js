async function create(routerType, reqBody) {
  const Record = require("../records/Record.js");
  //Record instance
  const record = new Record(routerType);
  let result = { created: false };

  try {
    let rec = await record.create(reqBody);
    result.created = true;
    result.result = await rec;
    return result;
  } catch (error) {
    result.result = error;
    return result;
  }
}

module.exports = create;
