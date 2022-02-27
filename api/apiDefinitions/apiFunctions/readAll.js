async function readAll(routerType) {
  const Record = require("../records/Record.js");
  //Record instance
  const record = new Record(routerType);
  let result = { read: false };

  try {
    rec = await record.getAll();
    result.read = true;
    result.result = await rec;
    return result;

    // return res.status(200).json(result);
  } catch (error) {
    result.read = false;
    result.result = error;
    return result;

    // return res.status(500).json({ error });
  }
}

module.exports = readAll;
