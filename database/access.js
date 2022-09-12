const {getItems} = require("./crud/read");
const {createItem} = require("./crud/create");

function QueryParams(
    id,
    defType,
    parentId,
    sourceId,
    targetId,
    layer,
    sortOfItem,
    title,
    from,
    limit
){
    this.id = id
    this.defType = defType
    this.parentId = parentId
    this.source = sourceId
    this.target = targetId
    this.layer = layer
    this.sortOfItem = sortOfItem
    this.title = title
    this.from = from
    this.limit = limit
}

const access = {
    getItems,
    createItem,

}

module.exports = { access }