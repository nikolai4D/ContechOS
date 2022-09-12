const {Voc} = require("../Voc");

function getDefTypeFromCoords(coords){
    console.log("getDefTypeFromCoords coords: " + JSON.stringify(coords))
    let defType = Voc.layers[coords[0]][0]
    if(coords[1] !== null && coords[1] !== undefined) defType += Voc.relationTypes[coords[1]][0]
    return  defType
}

function getDefTypeFromId(id){
    console.log("getDefTypeFromId: " + id)
    let coords = getCoordsFromId(id)
    return getDefTypeFromCoords(coords)
}

function getLayerFromId(id){
    try {
        const prefix = getPrefixFromString(id)
        return findLayerIndexByPrefix(prefix)
    }catch(e){
        return e
    }
}

function getCoordsFromId(id){
    const prefix = getPrefixFromString(id)
    if (prefix === null) return
    return getCoordsFromPrefix(prefix)
}

function getPrefixFromString(string){
    const prefix = string.substring(0,string.indexOf("_"))
    if (prefix === ""){ throw("invalid id : prefix could not be determined.") }
    return prefix
}

function getCoordsFromPrefix(prefix){
    const prefixStart = (findLayerIndexByPrefix(prefix))
    const prefixEnd = getRelationIndexFromPrefix(prefix)
    if (prefixStart === -1  || prefixEnd === -1){ throw("coords from prefix could not be determined, prefix: " + prefix) }
    return [prefixStart, prefixEnd]
}

function findLayerIndexByPrefix (prefix){
    const layerIndex = Voc.layers.findIndex(el => el[1] === prefix.substring(0,2))
    if( layerIndex === -1 ){ throw("invalid layer index, provided prefix: " + prefix) }
    return layerIndex
}

function getRelationIndexFromPrefix(prefix){
    if(prefix.length === 2) return null
    else if (prefix.charAt(2) === "e") return 0
    else if (prefix.charAt(2) === "i") return 1
    else throw("relation index from prefix could not be determined, prefix: " + prefix)
}

module.exports = {getDefTypeFromCoords, getLayerFromId, getCoordsFromId, getDefTypeFromId}