const { access } = require("../../database/access");

async function queryNodesResolver(params={}, enforcedParams) {
    params.sortOfItem = "node"
    return await graphResolver(params,enforcedParams)
}

async function queryRelationsResolver(params={}, enforcedParams){
    params.sortOfItem = "relation"
    return await graphResolver(params, enforcedParams)
}

async function graphResolver(params = {}, enforcedParams={}) {
    for (let key in enforcedParams) {
        if (params[key] !== undefined) console.log(key + " cannot be overwritten in the current context.")
        params[key] = enforcedParams[key]
    }

    const requestedItems = await access.getItems(params)
    //console.log("requested items: " + JSON.stringify(requestedItems))
    return requestedItems
}

module.exports = {queryNodesResolver, queryRelationsResolver}