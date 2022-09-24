const { getItems } = require("./dbAccessLayer/crud/read");

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

module.exports = { graphResolver, itemsResolver }