import getData from "./graphFunctions/getData.js";

const ContextMenu = (event, d) => {
  let data = [];

  if (event.target.tagName === "svg") {
    const group = window.location.pathname.substring(1);
    let defTitle = "group";
    data = getData(defTitle, group);
  } else if (event.target.tagName === "circle" || event.target.className.baseVal === 'nodeLabel') {
    let defTitle = "nodeType";
    data = getData(defTitle, d.defTypeTitle);
  }

  let dataArray = data.map(
    (obj) =>
      `<div class="list-group-item list-group-item-action context_menu_item" data-defId="${obj.defId}" data-defTypeId="${obj.defTypeId}">
               + ${obj.defTypeDisplayTitle}
        </div>`
  );

  const template = `  
        <div id="contextMenu" class="contextMenu position-absolute">
            <div id="list-group-contextmenu" class="list-group list-group-contextmenu">
                ${dataArray.join("")}
                <div id="delete-item"></div>
            </div>
        </div>
    `;

  return template;
};

export default ContextMenu;
