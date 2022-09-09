const {Voc} = require("./Voc");

function getDefTypeFromCoords(coords){
    let defType = Voc.layers[coords[0]][0]
    if(coords[1] !== null && coords[1] !== undefined) defType += Voc.relationTypes[coords[1]][0]
    return  defType
}

function getLayerFromId(id){
    const prefix = getPrefixFromString(id)
    return findLayerIndexByPrefix(prefix)
}

function getCoordsFromId(id){
    const prefix = getPrefixFromString(id)
    console.log("prefix: " + prefix)
    return getCoordsFromPrefix(prefix)
}

function getPrefixFromString(string){
    return string.substring(0,string.indexOf("_"))
}

function getCoordsFromPrefix(prefix){
    return [(findLayerIndexByPrefix(prefix)), getRelationIndexFromPrefix(prefix)]
}

function findLayerIndexByPrefix (prefix){
    return Voc.layers.findIndex(el => el[1] === prefix.substring(0,2))
}

function getRelationIndexFromPrefix(prefix){
    if(prefix.length !== 4) return null
    else if (prefix.charAt(2) === "e") return 0
    else if (prefix.charAt(2) === "i") return 1
}

module.exports = {getDefTypeFromCoords, getLayerFromId, getCoordsFromId}