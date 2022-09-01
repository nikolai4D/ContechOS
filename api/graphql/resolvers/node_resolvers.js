const {getItemsMatchingParams, getAllNodes} = require("../helpers/helpers");

function queryNodesResolver(params){
    console.log("node resolver params: " + JSON.stringify(params))
    return (params !== undefined)? getItemsMatchingParams(params, "node") : getAllNodes()
}

module.exports = {queryNodesResolver}