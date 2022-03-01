const propKeysExists = (propKeys, res) => {
  let keys = [];
  const Record = require("../records/Record.js");
  const propKeyRecord = new Record("propKey");
  const propKeyArray = propKeyRecord.getAllId();

  propKeys.forEach((key) => {
    if (!propKeyArray.includes(key)) {
      keys.push(key);
    }
  });

  if (keys.length > 0) {
    res.status(400).send(`missing propKeys: ${keys}`);
    return false;
  } else {
    return true;
  }
};

module.exports = propKeysExists;
