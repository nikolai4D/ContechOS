import nodeDefs from "../store/definitions.js";

const ContextMenu = (d) => {
    const nodeGroup = window.location.pathname.substring(1);

    const validNodeTypesByNodeGroup = nodeDefs.nodeGroups.find(obj => {
        return obj.title === nodeGroup;
    }).nodeTypes;

    const nodeTypesDetail = nodeDefs.nodeTypes.filter((type) => {
        if (validNodeTypesByNodeGroup.includes(type.nodeTypeId))
            return type
    });



    const data = nodeTypesDetail.map((type) => { return { "title": `Create ${type.title}`, "id": `${type.nodeTypeId}` } })
    console.log(data)
    let dataArray = data.map(obj =>
        `<div class="list-group-item list-group-item-action context_menu_item" id="${obj.id}">
                ${obj.title}
        </div>`);

    const template = `  
        <div class="contextMenu position-absolute">
            <div class="list-group">
                ${dataArray.join("")}
            </div>
        </div>
    `;

    return template;
}

export default ContextMenu;

