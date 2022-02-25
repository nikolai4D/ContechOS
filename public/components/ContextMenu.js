import getData from "./graphFunctions/getData.js";

const ContextMenu = (event, d) => {
  let data = [];
  let defTitle = "";

  if (event.target.tagName === "svg") {
    const group = window.location.pathname.substring(1);
    defTitle = "group";
    data = getData(defTitle, group);
  } else if (event.target.tagName === "circle" || event.target.className.baseVal === 'nodeLabel') {
    defTitle = "nodeType";
    data = getData(defTitle, d.defTypeTitle);
  }
  else if (event.target.className.baseVal === "linkLabel" || event.target.className.baseVal === 'linkSVG') {
    defTitle = "relType";
    data = getData(defTitle, d.defTypeTitle);
  }
  let hasLinks = [];
  let dataArray = data.map(
    (obj) => {
      if (obj.defId !== 2) {
        return `<div class="list-group-item list-group-item-action context_menu_item" data-defId="${obj.defId}" data-defTypeId="${obj.defTypeId}">
               + ${obj.defTypeDisplayTitle}
        </div>`
      }
      hasLinks.push(obj.defTypeId);
    }
  );

  if (hasLinks.length > 0) {
    dataArray.push(`<div class="list-group-item list-group-item-action context_menu_item" data-defId="2" data-defTypeId="${hasLinks.join(",")}">
              + Link
        </div>`)
  }

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
