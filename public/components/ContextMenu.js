//import defs from../store/definitions.js.jsjs";

const ContextMenu = (event, d) => {
  const definitions = JSON.parse(sessionStorage.getItem("definitions"))[0];

  const group = window.location.pathname.substring(1);

  // group object

  let groups = definitions.defs.find((obj) => obj.title === "groups").defTypes;

  let validNodeTypesByGroup = groups.find((obj) => {
    return obj.title === group;
  });

  let typesDetail = [];
  let data = [];

  if (event.target.tagName === "circle") {
    getTypesDetail("relTypes", "relTypeId");
    // console.log(d, "d");
    getDataByTypesDetail("relTypeId");
  } else if (event.target.tagName === "svg") {
    getTypesDetail("nodeTypes", "nodeTypeId");
    getDataByTypesDetail("nodeTypeId");
  }

  function getTypesDetail(types, typeId) {
    validNodeTypesByGroup = validNodeTypesByGroup[types];
    if (group !== "props" && event.target.tagName === "circle") {
      // Only getting relTypes that are in nodeType object in definitions
      let validRelTypesByNodeType = defs.nodeTypes.find(
        (nodeType) => nodeType.title === d.nodeType
      ).relTypes;
      validNodeTypesByGroup = validRelTypesByNodeType;
    }

    let definitionsTypes = definitions.defs.find((obj) => obj.title === types)
      .defTypes;

    typesDetail = definitionsTypes.filter((type) => {
      if (validNodeTypesByGroup.includes(type[typeId])) return type;
    });
  }

  function getDataByTypesDetail(typeId) {
    data = typesDetail.map((type) => {
      return { title: `${type.title}`, id: `${type[typeId]}` };
    });
  }

  let dataArray = data.map(
    (obj) =>
      `<div class="list-group-item list-group-item-action context_menu_item" id="${obj.id}">
                ${obj.title}
        </div>`
  );

  const template = `  
        <div class="contextMenu position-absolute">
        <div><h3>create:</h3></div>
            <div class="list-group">
                ${dataArray.join("")}
            </div>
        </div>
    `;

  return template;
};

export default ContextMenu;
