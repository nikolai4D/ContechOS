async function checkPropsAndPropKeys(
  routerType,
  foundParentIdofProps,
  foundPropKeys,
  propKeysTitle
) {
  const Record = require("../../records/Record.js");

  if (routerType === "instanceData") {
    const parentRouterTypeRecord = new Record("typeData");
    let foundParentParentIdofProps = (
      await parentRouterTypeRecord.getParent(foundParentIdofProps.parentId)
    );
    foundParentIdofProps = foundParentParentIdofProps;
  }
  if (
    routerType === "instanceDataInternalRel"
  ) {
    const parentRouterTypeRecord = new Record("typeDataInternalRel");
    let foundParentParentIdofProps = (
      await parentRouterTypeRecord.getParent(foundParentIdofProps.parentId)
    );
    foundParentIdofProps = foundParentParentIdofProps;
  }

  if (
    routerType === "instanceDataExternalRel"
  ) {
    const parentRouterTypeRecord = new Record("typeDataExternalRel");
    let foundParentParentIdofProps = (
      await parentRouterTypeRecord.getParent(foundParentIdofProps.parentId)
    );
    foundParentIdofProps = foundParentParentIdofProps;
  }

  let propsFound = foundParentIdofProps[propKeysTitle];

  if (propsFound === undefined) {
    propsFound = [];
  }

  // console.log(foundParentIdofProps, "foundParentIdofProps");

  // console.log(propKeysTitle, "propKeysTitle");
  // console.log(propsFound, "propsFound");
  // console.log(foundPropKeys, "foundPropKeys");
  propsFound.sort(), foundPropKeys.sort();

  if (propsFound.toString() === foundPropKeys.toString()) {
    return true;
  } else {
    return false;
  }
}

async function propsExists(parentId, routerType, props, res) {
  const Record = require("../../records/Record.js");
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

  for (const obj of props) {
    if (!typeof obj === "object") {
      res.status(400).send(`propVal must be object`);
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
  }

  //If all propVals and propKeys exists ->  check if provided propKeys matches parent propKey specification

  //get parent object
  const parentOfProps = await routerTypeRecord.getParent(parentId);
  const foundParentIdofProps = await parentOfProps;

  //get parentParent object

  let testedPropsEqualsPropKeys;

  if (routerType === "instanceData") {
    testedPropsEqualsPropKeys = await checkPropsAndPropKeys(
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
    testedPropsEqualsPropKeys = await checkPropsAndPropKeys(
      routerType,
      foundParentIdofProps,
      foundPropKeys,
      "instanceDataRelPropKeys"
    );
  }
  if (routerType === "typeData") {
    testedPropsEqualsPropKeys = await checkPropsAndPropKeys(
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
    testedPropsEqualsPropKeys = await checkPropsAndPropKeys(
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
    testedPropsEqualsPropKeys = await checkPropsAndPropKeys(
      routerType,
      foundParentIdofProps,
      foundPropKeys,
      "propKeys"
    );
  }

  if (testedPropsEqualsPropKeys) {
    return true;
  } else {
    res.status(400).send(`props doesn't match propKeys`);
    return false;
  }
}

module.exports = propsExists;
