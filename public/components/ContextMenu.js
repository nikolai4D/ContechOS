//import nodeDefs from../store/definitions.js.jsjs";

const ContextMenu = (event, d) => {
  const nodeDefs = JSON.parse(sessionStorage.getItem("definitions"))[0];

  const group = window.location.pathname.substring(1);

  let validNodeTypesByGroup = nodeDefs.groups.find((obj) => {
    return obj.title === group;
  });

  let typesDetail = [];
  let data = [];

  function getTypesDetail(types, typeId) {
    validNodeTypesByGroup = validNodeTypesByGroup[types];
    typesDetail = nodeDefs[types].filter((type) => {
      if (validNodeTypesByGroup.includes(type[typeId])) return type;
    });
  }

  function getDataByTypesDetail(typeId) {
    data = typesDetail.map((type) => {
      return { title: `Create ${type.title}`, id: `${type[typeId]}` };
    });
  }

  if (event.target.tagName === "circle") {
    getTypesDetail("relTypes", "relTypeId");
    getDataByTypesDetail("relTypeId");
  } else if (event.target.tagName === "svg") {
    getTypesDetail("nodeTypes", "nodeTypeId");
    getDataByTypesDetail("nodeTypeId");
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
