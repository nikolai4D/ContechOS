async function createBulkRel(routerType, reqBody, res) {
  const Record = require("../../records/Record.js");

  let recordNodeRouterType;
  if (
    routerType === "typeDataInternalRel" ||
    routerType === "typeDataExternalRel"
  ) {
    recordNodeRouterType = "typeData";
  }
  if (
    routerType === "instanceDataInternalRel" ||
    routerType === "instanceDataExternalRel"
  ) {
    recordNodeRouterType = "instanceData";
  }
  if (
    routerType === "configObjInternalRel" ||
    routerType === "configObjExternalRel"
  ) {
    recordNodeRouterType = "configObj";
  }

  const recordNode = new Record(recordNodeRouterType);
  //Record instance
  const record = new Record(routerType);

  const imported = [];
  const rejected = [];
  const results = { imported, rejected };

  //console.log(reqBody.objects);

  const { objects } = reqBody;

  async function loopObjects(obj) {
    const getSourceTargetParent = async () => {
      //obj.source

      const getSource = await recordNode.getByTitle(obj.sourceTitle);
      const sourceId = await getSource[0].id;

      //obj.target
      const getTarget = await recordNode.getByTitle(obj.targetTitle);
      const targetId = await getTarget[0].id;

      const getParent = await record.getParent(obj.parentId);
      const titleOfParent = await getParent.title;

      let sendObj = {
        source: sourceId,
        target: targetId,
        parentId: obj.parentId,
        title: titleOfParent,
        props: obj.props,
      };

      try {
        let result = await record.create(sendObj);
        imported.push(await result.id);
      } catch (error) {
        rejected.push(sendObj);
      }
    };

    await getSourceTargetParent();
  }

  for (const obj of objects) {
    await loopObjects(obj);
  }

  return res.status(200).json(results);
}

module.exports = createBulkRel;


// async function createBulkRel(routerType, reqBody, res) {
//   const Record = require("../../records/Record.js");

//   let recordNodeRouterType;
//   if (
//     routerType === "typeDataInternalRel" ||
//     routerType === "typeDataExternalRel"
//   ) {
//     recordNodeRouterType = "typeData";
//   }

//   const recordNode = new Record(recordNodeRouterType);
//   // Record instance
//   const record = new Record(routerType);

//   const imported = [];
//   const rejected = [];
//   const results = { imported, rejected };

//   const { objects } = reqBody;

//   async function loopObjects(obj) {
//     const getSourceTargetParent = async () => {
//       // obj.source
//       const getSource = await recordNode.getByTitle(obj.sourceTitle);
//       const sourceId = await getSource[0].id;

//       // obj.target
//       const getTarget = await recordNode.getByTitle(obj.targetTitle);
//       const targetId = await getTarget[0].id;

//       const getParent = await record.getParent(obj.parentId);
//       const titleOfParent = await getParent.title;

//       let sendObj = {
//         source: sourceId,
//         target: targetId,
//         parentId: obj.parentId,
//         title: titleOfParent,
//         props: obj.props,
//       };

//       try {
//         let result = await record.create(sendObj);
//         imported.push(await result.id);
//       } catch (error) {
//         rejected.push(sendObj);
//       }
//     };

//     await getSourceTargetParent();
//   }

//   // Define chunk size
//   const chunkSize = 250;

//   // Loop through the objects array, chunk by chunk
//   for (let i = 0; i < objects.length; i += chunkSize) {
//     const chunk = objects.slice(i, i + chunkSize);

//     // Process each chunk (you can await here if you want to process each chunk sequentially)
//     for (const obj of chunk) {
//       await loopObjects(obj);
//     }
//   }

//   return res.status(200).json(results);
// }

// module.exports = createBulkRel;
