import getData from "./graphFunctions/getData.js";

const ContextMenu = (event, d) => {
  let data = [];

  if (event.target.tagName === "svg") {
    const group = window.location.pathname.substring(1);
    let defTitle = "groups";
    data = getData(defTitle, group);
  } else if (event.target.tagName === "circle") {
    let defTitle = "nodeTypes";
    data = getData(defTitle, d.nodeType);
  }

  let dataArray = data.map(
    (obj) =>
      `<div class="list-group-item list-group-item-action context_menu_item" data-defId="${obj.defId}" data-defTypeId="${obj.defTypeId}">
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
