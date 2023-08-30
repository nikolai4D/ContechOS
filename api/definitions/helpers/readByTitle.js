async function readByTitle(routerType, reqTitle, res) {
  const Record = require("../../records/Record.js");
  const record = new Record(routerType);

  try {
    result = await record.getByTitle(reqTitle);
    res.status(200).json(result);
    return true;
  } catch (error) {
    res.status(500).json({ error });
    return false;
  }
}

module.exports = readByTitle;
