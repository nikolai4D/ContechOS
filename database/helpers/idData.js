const {Voc} = require("../Voc");
const {doesFileExist, getItemById} = require("../FileManager");

/**
 * Infer data from id
 * @param id
 * @constructor
 */
function IdData(id){
    this.id = id
    this.abbr = getAbbrFromId(this.id)
    this.kindOfItem = getKindOfItemFromAbbr(this.abbr)
    this.layerIndex = getLayerIndexFromAbbr(this.abbr)
    this.layer = Voc.layers[this.layerIndex]
    this.relationType = getRelationTypeFromAbbr(this.abbr)
    this.propertyType = getPropertyTypeFromAbbr(this.abbr, this.kindOfItem)
    this.defType = this.layer.inString + this.relationType.inString + this.propertyType.inString
    this.exists = doesFileExist(this.id, this.defType)

    this.loadedItem = null
    this.item = ()=> { //This way we don't fetch item before it s necessary, and we fetch it only once.
        if(this.loadedItem === null) this.loadedItem = getItemById(this.id, this.defType)
        return this.loadedItem
    }
    this.parentId = ()=> getParentId(this.layerIndex, this.item())
    this.targetId = ()=> getTargetId(this.kindOfItem, this.item())
    this.sourceId = ()=> getSourceId(this.kindOfItem, this.item())
}

function getAbbrFromId(string){
    const abbr = string.substring(0,string.indexOf("_"))
    if (abbr === ""){ throw("invalid id : prefix could not be determined.") }
    return abbr
}

function getKindOfItemFromAbbr(abbr){
    let koi
    if(abbr[0] === "p") koi = Voc.kindsOfItem[2]
    else if (abbr.length === 4) koi =  Voc.kindsOfItem[1]
    else if (abbr.length === 2) koi =  Voc.kindsOfItem[0]
    else throw "kind of item could not be identified, id is invalid."
    console.log("kind of item: " + JSON.stringify(koi))
    return koi
}

function getLayerIndexFromAbbr(abbr){
    if(abbr.charAt(0) === "c"){
        if(abbr.charAt(0) === "d") return 0
        else if (abbr.charAt(0) === "o") return 1
    }
    else if(abbr.charAt(0) === "t") return 2
    else if(abbr.charAt(0) === "i") return 3
    else if(abbr.charAt(0) === "p") return 4
    else throw "unable to determine kind of item. id is invalid."
}

function getRelationTypeFromAbbr(abbr){
    if(abbr.length === 2) return Voc.relationTypes.none
    else if (abbr.charAt(2) === "e") return Voc.relationTypes.exRel
    else if (abbr.charAt(2) === "i") return Voc.relationTypes.inRel
    else throw("relation index from abbr \"" + abbr + "\" could not be determined.")
}

function getPropertyTypeFromAbbr(abbr, koi){
    if(koi !== Voc.kindsOfItem[2]) return Voc.propertyTypes.none
    for(let type of Voc.propertyTypes){
        console.log("type: " + JSON.stringify(type))
        if (type.abbr === abbr.charAt(1)) return Voctype
    }
    throw("property type could not be inferred. Id is invalid.")
}

function getParentId(layerIndex, item){
    if([0, 4].includes(layerIndex)) return null
    else if (item.hasOwnProperty("parentId")) return item.parentId
    else throw "parentId is missing."
}

function getTargetId(koi, item){
    if(koi !== "relation") return null
    else if (item.hasOwnProperty("target")) return item.target
    else throw "target is missing in item."
}

function getSourceId(koi, item){
    if(koi !== "relation") return null
    else if (item.hasOwnProperty("source")) return item.source
    else throw "source is missing in item."
}

module.exports = {IdData}