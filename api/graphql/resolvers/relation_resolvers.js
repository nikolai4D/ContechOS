const {getItemsMatchingParams, getAllRelations} = require("../helpers/helpers");

function queryRelationsResolver(params){
    console.log("relation resolver params: " + JSON.stringify(params))
    return (params !== undefined)? getItemsMatchingParams(params, "relation") : getAllRelations()
}

module.exports = { queryRelationsResolver }