async function remove(routerType, id, res) {
  const Record = require("../../records/Record.js");
  const record = new Record(routerType);

  try {
    result = await record.remove(id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error });
  }
}

module.exports = remove;
