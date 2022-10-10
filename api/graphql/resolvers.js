const { getItems } = require("./dbAccessLayer/crud/read");
const cascade = require("./dbAccessLayer/helpers/cascade");
const {voc} = require("./dbAccessLayer/voc");

const definitionTypes = [
    "configDef",
    "configDefExternalRel",
    "configDefInternalRel",
    "configObj",
    "configObjExternalRel",
    "configObjInternalRel",
    "typeData",
    "typeDataExternalRel",
    "typeDataInternalRel",
    "instanceData",
    "instanceDataExternalRel",
    "instanceDataInternalRel",
    "PropType",
    "PropKey",
    "PropVal"
]

async function itemsResolver(params = {}, enforcedParams = {}) {
    for (let key in enforcedParams) {
        if (params[key] !== undefined) console.log(key + " cannot be overwritten in the current context.")
        params[key] = enforcedParams[key]
    }

    const items = await getItems(params)


    let answer = {}
    for (let defType of definitionTypes) {
        answer[defType] = []
    }
    for (let item of items) {
        answer[item.defType].push(item)
    }

    return answer
}

async function graphResolver(params = {}, enforcedParams = {}, isUniqueOrNull = false) {
    for (let key in enforcedParams) {
        if (params[key] !== undefined) console.log(key + " cannot be overwritten in the current context.")
        params[key] = enforcedParams[key]
    }

    const items = await getItems(params)
    if (isUniqueOrNull) {
        if (items.length === 1) return items[0]
        else if (items.length === 0) return null
        else if (items.length < 1) return { error: "multiple corresponding items were found when only one was expected." }
    }

    return items
}

async function cascadeResolver(cascade, depth, parentId) {
    let layerName = voc.layers[depth].inString
    let children = cascade[layerName+"Nodes"].filter(item => item.parentId === parentId)
    console.log("children: " + JSON.stringify(children, null, 2))
    children.map(child => {
        child.depth = depth
        child.cascade = cascade
    })
    return children
}



module.exports = { graphResolver, cascadeResolver }