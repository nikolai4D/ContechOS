async function create(routerType, reqBody, res) {
  const Record = require("../../records/Record.js");
  //Record instance
  const record = new Record(routerType);

  try {
    let result = await record.create(reqBody);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error });
  }
}

module.exports = create;
