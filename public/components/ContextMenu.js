//import nodeDefs from "../store/definitions.js";

const ContextMenu = (event, d) => {
  const nodeDefs = JSON.parse(sessionStorage.getItem("definitions"))[0];

  console.log(nodeDefs, "nodeDefs");

  const group = window.location.pathname.substring(1);

  let validNodeTypesByGroup = nodeDefs.groups.find((obj) => {
    return obj.title === group;
  });

  let typesDetail = [];
  let data = [];

  function getTypesDetail(types, typeId) {
    console.log(nodeDefs, "nodeDefs2");
    validNodeTypesByGroup = validNodeTypesByGroup[types];
    typesDetail = nodeDefs[types].filter((type) => {
      if (validNodeTypesByGroup.includes(type[typeId])) return type;
    });
  }
  console.log(validNodeTypesByGroup, "validNodeTypesByGroup");
  console.log(typesDetail, "typesDetail");

  function getDataByTypesDetail(typeId) {
    data = typesDetail.map((type) => {
      return { title: `Create ${type.title}`, id: `${type[typeId]}` };
    });
  }

  console.log(data, "data");

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

  console.log(dataArray, "dataArray");

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
