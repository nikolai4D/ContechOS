import nodeDefs from "../store/definitions.js";

const ContextMenu = (d) => {
    const nodeGroup = window.location.pathname.substring(1);

    const validNodeTypesByNodeGroup = nodeDefs.nodeGroups.find(obj => {
        return obj.title === nodeGroup;
    }).nodeTypes;

    const nodeTypesDetail = nodeDefs.nodeTypes.filter((type, index) => {
        if (validNodeTypesByNodeGroup.includes(type.nodeTypeId))
            return type
    });

    const data = nodeTypesDetail.map((type) => { return { "title": `Create ${type.title}`, "id": `${type.id}` } })

    let dataArray = data.map(obj =>
        `<li class="item">
            <div class="itemContent" id="${obj.nodeTypeId}">
                ${obj.title}
            </div>
        </li>`);

    const template = `  
        <div class="contextMenu">
            <ul class="menu">
                ${dataArray.join("")}
            </ul>
        </div>
    `;

    return template;
}

export default ContextMenu;

