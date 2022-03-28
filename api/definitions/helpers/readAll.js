async function readAll(routerType, res) {
  const Record = require("../../records/Record.js");
  //Record instance
  const record = new Record(routerType);

  try {
    result = await record.getAll();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error });
  }
}

module.exports = readAll;
