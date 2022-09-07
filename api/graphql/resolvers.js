const {Accessor} = require("../../DBaccess/Accessor");

async function queryNodesResolver(params={}, enforcedParams) {
    params.sortOfItem = "node"
    console.log("node resolver")
    return await graphResolver(params,enforcedParams)
}

async function queryRelationsResolver(params={}, enforcedParams){
    params.sortOfItem = "relation"
    console.log("relation resolver")
    return await graphResolver(params, enforcedParams)
}

async function graphResolver(params = {}, enforcedParams={}) {
    //console.log("resolver -  submitted  params: " + JSON.stringify(params))
    for (let key in enforcedParams) {
        //console.log("enforcedParams key: " + key)
        if (params[key] !== undefined) console.log(key + " cannot be overwritten in the current context.")
        params[key] = enforcedParams[key]
    }

    console.log("resolver -  formatted  params: " + JSON.stringify(params))
    const requestedItems = await (new Accessor().getItems(params))
    //console.log("requested items: " + JSON.stringify(requestedItems))
    return requestedItems
}

module.exports = {queryNodesResolver, queryRelationsResolver}