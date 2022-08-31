const simplifiedDB = require("./simplifiedDB")
const slightlyMoreComplexDB = require("./slighltyMoreComplexDB");

function queryNodeResolver(args){
    //const depth = args.depth ?? 5
    return simplifiedDB.nodes.filter(el => el.id === args.id)
}

function queryRelationResolver(args){
    //const depth = args.depth ?? 5
    return simplifiedDB.relations.filter(el => el.id === args.id)
}

// We could make a generic method that filter by all the arguments provided, no time now. So here it just return an array of one.
function queryContechNodeResolverByID(args){
    console.log("queryContechNode entered, args: " + JSON.stringify(args, null,2))
    return getDBNodeById(args.id)
}

function queryParentNodeResolver(childId){
    console.log("queryParentNode entered, childId: " + childId)
    const child = getDBNodeById(childId)
    const parent = getDBNodeById(child.parentId)
    console.log("parent: " + JSON.stringify(parent))
    return parent
}

function queryContechRelationResolver(args){
    const repertory = getRepertoryFromId(args.id)
    console.log({repertory})
    return slightlyMoreComplexDB[repertory].filter(el => el.id === args.id)
}

function getDBNodeById(id){
    const repertory = getRepertoryFromId(id)
    console.log("getNodebyId-> id:" + id + ", repertory: " + repertory)
    const node = slightlyMoreComplexDB[repertory].find(el => el.id === id)
    console.log({node})
    return node
}

function getRepertoryFromId(id){
    let layer
    switch (id[2]) {
        case "t":
            layer = "type"
            break;
        case "i":
            layer = "instance"
            break;
        default:
            console.log("layer prefix unknown: " + id[2])
    }

    let nature
    switch (id[0]) {
        case "n":
            nature = "data"
            break;
        case "r":
            nature = "rel"
            break;
        default:
            console.log("nature prefix unknown: " + id[0])
    }

    return layer+"_"+nature
}

module.exports = {queryNodeResolver, queryContechNodeResolver: queryContechNodeResolverByID, queryParentNodeResolver}