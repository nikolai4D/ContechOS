const {Accessor} = require("../../DBaccess/Accessor");

async function queryNodesResolver(params) {
    console.log("node resolver params: " + JSON.stringify(params))
    const accessor = new Accessor()
    if (params === undefined) params = {}
    params.sortOfItem = "node"
    const response = await accessor.getItems(params)
    return response
}

async function queryRelationsResolver(params){
    // console.log("relation resolver params: " + JSON.stringify(params))
    if (params === undefined) params = {}
    params.sortOfItem = "relation"
    const response = await (new Accessor()).getItems(params)
    // console.log(" relation response: " + JSON.stringify(response))
    return response
}

module.exports = {queryNodesResolver, queryRelationsResolver}