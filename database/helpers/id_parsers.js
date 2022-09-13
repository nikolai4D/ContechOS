const {Voc} = require("../Voc");

function getDefTypeFromCoords(coords){
    console.log("getDefTypeFromCoords coords: " + JSON.stringify(coords))
    let defType = Voc.layers[coords[0]].toString
    //if(coords[1] !== null && coords[1] !== undefined) defType += Voc.relationTypes[coords[1]]
    if (coords[1] === 0 ) defType += Voc.relationTypes
    return  defType
}

function getDefTypeFromId(id){
    let coords = getCoordsFromId(id)
    let defType = getDefTypeFromCoords(coords)
    console.log("getDefTypeFromId: " + id + ", defType: " + defType)
    return defType
}

function getCoordsFromId(id){
    const prefix = getAbbrFromId(id)
    if (prefix === null) return
    return getCoordsFromAbbr(prefix)
}

function getAbbrFromId(string){
    const abbr = string.substring(0,string.indexOf("_"))
    if (abbr === ""){ throw("invalid id : prefix could not be determined.") }
    return abbr
}

function getCoordsFromAbbr(abbr){
    const prefix = (findLayerIndexByPrefix(abbr))
    const suffix = getRelationIndexFromPrefix(abbr)
    if (prefix === -1  || suffix === -1){ throw("coords from prefix could not be determined, prefix: " + abbr) }
    return [prefix, suffix]
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



module.exports = {getDefTypeFromCoords, getCoordsFromId, getDefTypeFromId}