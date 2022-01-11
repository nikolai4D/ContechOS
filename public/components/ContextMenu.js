const ContextMenu = (d) => {

    const data = [{ "title": "Create", "id": "1" }]

    let dataArray = data.map(obj =>
        `<li class="item">
            <div class="itemContent" id="${obj.id}">
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