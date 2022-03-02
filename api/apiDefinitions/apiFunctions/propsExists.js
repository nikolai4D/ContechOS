async function checkPropsAndPropKeys(
  routerType,
  foundParentIdofProps,
  foundPropKeys,
  propKeysTitle
) {
  const Record = require("../records/Record.js");
  if (
    routerType === "instanceData" ||
    routerType === "instanceDataExternalRel" ||
    routerType === "instanceDataInternalRel"
  ) {
    if (routerType === "instanceData") {
      const parentRouterTypeRecord = new Record("typeData");
      let foundParentParentIdofProps = (
        await parentRouterTypeRecord.getParent(foundParentIdofProps.parentId)
      ).parentId;
      foundParentIdofProps = foundParentParentIdofProps;
    }
    if (routerType === "instanceDataExternalRel") {
      const parentRouterTypeRecord = new Record("typeDataExternalRel");
      let foundParentParentIdofProps = (
        await parentRouterTypeRecord.getParent(foundParentIdofProps.parentId)
      ).parentId;
      foundParentIdofProps = foundParentParentIdofProps;
    }
    if (routerType === "instanceDataInternalRel") {
      const parentRouterTypeRecord = new Record("typeDataInternalRel");
      let foundParentParentIdofProps = (
        await parentRouterTypeRecord.getParent(foundParentIdofProps.parentId)
      ).parentId;
      foundParentIdofProps = foundParentParentIdofProps;
    }
  }

  const propsFound = foundParentIdofProps[propKeysTitle];

  if (!propsFound === foundPropKeys) {
    res.status(400).send(`props doesn't match propKeys from configOjv`);
    return false;
  }
}

async function propsExists(parentId, routerType, props, res) {
  const Record = require("../records/Record.js");
  const propKeyRecord = new Record("propKey");
  const propKeyArray = propKeyRecord.getAllId();
  const propValRecord = new Record("propVal");
  const propValArray = propValRecord.getAllId();
  const routerTypeRecord = new Record(routerType);

  if (!Array.isArray(props)) {
    res.status(400).send(`props must be an array`);
    return false;
  }
  let foundPropKeys = [];
  props.forEach(async (obj) => {
    let propsExists = false;
    propsExists = false;
    if (!typeof obj === "object") {
      res.status(400).send(`props content must be objects`);
      return false;
    }
    //propVal
    const propVal = Object.values(obj)[0];
    if (!propValArray.includes(propVal)) {
      res.status(400).send(`propVal ${propVal} doesn't exist`);
      return false;
    }
    //get parentId from propVal and compare to propKey
    const propValParentId = (await propValRecord.getById(propVal)).parentId;
    const propKey = Object.keys(obj)[0];

    if (!propValParentId === propKey) {
      res.status(400).send(`propKey ${propKey} doesn't match propVal.parentId`);
      return false;
    }
    foundPropKeys.push(propKey);

    //check if propKey exists
    if (!propKeyArray.includes(propKey)) {
      res.status(400).send(`propKey ${propKey} doesn't exist`);
      return false;
    }
    propsExists = true;
  });

  //check if provided propKeys matches parent propKey specification

  //get parent object
  const parentOfProps = await routerTypeRecord.getParent(parentId);
  let foundParentIdofProps = parentOfProps;

  //get parentParent object

  if (routerType === "instanceData") {
    checkPropsAndPropKeys(
      routerType,
      foundParentIdofProps,
      foundPropKeys,
      "instanceDataPropKeys"
    );
  }
  if (
    routerType === "instanceDataExternalRel" ||
    routerType === "instanceDataInternalRel"
  ) {
    checkPropsAndPropKeys(
      routerType,
      foundParentIdofProps,
      foundPropKeys,
      "instanceDataRelPropKeys"
    );
  }
  if (routerType === "typeData") {
    checkPropsAndPropKeys(
      routerType,
      foundParentIdofProps,
      foundPropKeys,
      "typeDataPropKeys"
    );
  }
  if (
    routerType === "typeDataExternalRel" ||
    routerType === "typeDataInternalRel"
  ) {
    checkPropsAndPropKeys(
      routerType,
      foundParentIdofProps,
      foundPropKeys,
      "typeDataRelPropKeys"
    );
  }
  if (
    routerType === "configObj" ||
    routerType === "configObjExternalRel" ||
    routerType === "configObjInternalRel"
  ) {
    checkPropsAndPropKeys(
      routerType,
      foundParentIdofProps,
      foundPropKeys,
      "props"
    );
  }

  if (propsExists) {
    return true;
  } else {
    res.status(400).send(`props doesn't exist`);
    return false;
  }
}

module.exports = propsExists;
