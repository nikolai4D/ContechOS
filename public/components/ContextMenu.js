//import nodeDefs from../store/definitions.js.jsjs";

const ContextMenu = (event, d) => {
  const nodeDefs = JSON.parse(sessionStorage.getItem("definitions"))[0];

  const group = window.location.pathname.substring(1);

  // group object 
  let validNodeTypesByGroup = nodeDefs.groups.find((obj) => {
    return obj.title === group;
  });

  let typesDetail = [];
  let data = [];

  if (event.target.tagName === "circle") {
    getTypesDetail("relTypes", "relTypeId")
    console.log(d, 'd')
    getDataByTypesDetail("relTypeId");
  } else if (event.target.tagName === "svg") {
    getTypesDetail("nodeTypes", "nodeTypeId");
    getDataByTypesDetail("nodeTypeId");
  }

  function getTypesDetail(types, typeId) {
    validNodeTypesByGroup = validNodeTypesByGroup[types];
    if (group !== 'props' && event.target.tagName === "circle") {
      // Only getting relTypes that are in nodeType object in definitions
      let validRelTypesByNodeType = nodeDefs.nodeTypes.find(nodeType => nodeType.title === d.nodeType).relTypes;
      validNodeTypesByGroup = validRelTypesByNodeType;
    }
    typesDetail = nodeDefs[types].filter((type) => {
      if (validNodeTypesByGroup.includes(type[typeId])) return type;
    });
  }

  function getDataByTypesDetail(typeId) {
    data = typesDetail.map((type) => {
      return { title: `Create ${type.title}`, id: `${type[typeId]}` };
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
            <div class="list-group">
                ${dataArray.join("")}
            </div>
        </div>
    `;

  return template;
};

export default ContextMenu;
