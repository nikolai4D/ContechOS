async function propsExists(props, res) {
  const Record = require("../records/Record.js");
  const propKeyRecord = new Record("propKey");
  const propKeyArray = propKeyRecord.getAllId();
  const propValRecord = new Record("propVal");
  const propValArray = propValRecord.getAllId();

  if (!Array.isArray(props)) {
    res.status(400).send(`props must be an array`);
    return false;
  }

  props.forEach(async (obj) => {
    let propsExists = false;
    console.log(obj, "1");
    propsExists = false;
    if (!typeof obj === "object") {
      res.status(400).send(`props content must be objects`);
      return false;
    }
    //propVal
    const propVal = Object.values(obj)[0];
    console.log(propVal, "2");
    if (!propValArray.includes(propVal)) {
      res.status(400).send(`propVal ${propVal} doesn't exist`);
      return false;
    }
    //get parentId from propVal and compare to propKey
    const propValParentId = (await propValRecord.getById(propVal)).parentId;
    const propKey = Object.keys(obj)[0];
    console.log(propValParentId, propKey, "3");
    if (!propValParentId === propKey) {
      res.status(400).send(`propKey ${propKey} doesn't match propVal.parentId`);
      return false;
    }

    //check if propKey exists
    console.log(propKeyArray.includes(propKey), "4");
    if (!propKeyArray.includes(propKey)) {
      res.status(400).send(`propKey ${propKey} doesn't exist`);
      return false;
    }

    propsExists = true;
  });

  if (propsExists) {
    return true;
  } else {
    res.status(400).send(`props doesn't exist`);
    return false;
  }
}

module.exports = propsExists;
