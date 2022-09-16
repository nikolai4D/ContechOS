const {Voc} = require("../Voc");
const {doesFileExist, getItemById, getBulk} = require("../FileManager");
const {filterItems} = require("../helpers/filterItems");

/**
 * Infer data from id
 * @param id
 * @param shouldExists
 * @constructor
 */
function IdController(id, shouldExists = true){
    this.id = id
    this.abbr = getAbbrFromId(this.id)
    this.kindOfItem = getKindOfItemFromAbbr(this.abbr)
    this.layerIndex = getLayerIndexFromAbbr(this.abbr)
    this.layer = Voc.layers[this.layerIndex]
    this.relationType = getRelationTypeFromAbbr(this.abbr)
    this.propertyType = getPropertyTypeFromAbbr(this.abbr, this.kindOfItem)
    this.defType = this.layer.inString + this.relationType.inString + this.propertyType.inString
    this.exists = doesItemExistsInDb(this.id, this.defType, shouldExists)


    this.loadedItem = null
    this.item = ()=> { //This way we don't fetch item before it s necessary, and we fetch it only once.
        if(this.loadedItem === null) this.loadedItem = getItemById(this.id, this.defType)
        return this.loadedItem
    }

    this.parentId = ()=> getParentId(this.layerIndex, this.item())

    this.props = ()=> getProps(this.layerIndex, this.item)
    this.propKeys = ()=> getPropKeys(this.layerIndex, this.item)
    this.typeDataPropKeys = ()=> getTypeDataPropKeys()
    this.instanceDataPropKey = ()=> getInstanceDataPropKeys()

    this.childrenDefType = ()=> getChildrenDefType(this.layerIndex, this.relationType, this.propertyType)
    this.children = ()=> getChildren(this.id, this.childrenDefType)

    this.targetId = ()=> getTargetId(this.kindOfItem, this.item())
    this.sourceId = ()=> getSourceId(this.kindOfItem, this.item())

    this.relsItIsTargetOf= ()=> getRelsThisIsTargetOf(this.id)
    this.relsItIsSourceOf= ()=> getRelsThisIsSourceOf(this.id)
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
    return koi
}

function getLayerIndexFromAbbr(abbr){
    if(abbr.charAt(0) === "c"){
        if(abbr.charAt(1) === "d") return 0
        else if (abbr.charAt(1) === "o") return 1
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
    for(let type in Voc.propertyTypes){
        if (Voc.propertyTypes[type].abbr === abbr.charAt(1)) return Voc.propertyTypes[type]
    }
    throw("property type could not be inferred. Id is invalid.")
}

/**
 * Assert existence of the file in the db.
 * By default, it will throw an error if the file is not found.
 * If shouldExists is set to false, the non-existence of the file will instead return false.
 * @param id
 * @param defType
 * @param shouldExists
 * @returns {boolean}
 */
function doesItemExistsInDb(id, defType, shouldExists){
    if(!shouldExists)return false
    return doesFileExist(this.id, this.defType)
}

function getParentId(layerIndex, item, propertyType){
    if(layerIndex === 0 || (layerIndex == 4 && propertyType.inString === "Type")) return null
    else if (item.hasOwnProperty("parentId")) return item.parentId
    else throw new Error("parentId is missing.")
}

function getProps(layerIndex, item){
    if([0,4].includes(layerIndex)){
        if(item.hasOwnProperty("props")) throw new Error("Invalid state: props found as field on an incorrect layer. Item: " + JSON.stringify(item, null,2))
        else return null
    }
    else if (item.hasOwnProperty("props")) return item.props
    else throw new Error("invalid state: propKeys field is missing.")
}

function getPropKeys(layerIndex, item){
    if([1,2,3,4].includes(layerIndex)){
        if(item.hasOwnProperty("propKeys")) throw new Error("Invalid state: propKeys found as field of a non configDef item. Item: " + JSON.stringify(item, null,2))
        else return null
    }
    else if (item.hasOwnProperty("propKeys")) return item.propKeys
    else throw new Error("invalid state: propKeys field is missing.")
}

function getTypeDataPropKeys(layerIndex, item){
    if(layerIndex != 1){
        if(item.hasOwnProperty("propKeys")) throw new Error("Invalid state: typeDataPropKeys found as field of a non configObj item. Item: " + JSON.stringify(item, null,2))
        else return null
    }
    else if (item.hasOwnProperty("typeDataPropKeys")) return item.typeDataPropKeys
    else throw new Error("invalid state: propKeys field is missing.")
}

function getInstanceDataPropKeys(layerIndex, item){
    if(layerIndex != 1){
        if(item.hasOwnProperty("propKeys")) throw new Error("Invalid state: instanceDataPropKeys found as field of a non typeDef item. Item: " + JSON.stringify(item, null,2))
        else return null
    }
    else if (item.hasOwnProperty("instanceDataPropKeys")) return item.instanceDataPropKeys
    else throw new Error("invalid state: propKeys field is missing.")
}

function getChildrenDefType(layerIndex, relationType, propertyType){

    if(layerIndex === 3) throw "instance data cannot have children."
    if(layerIndex === 4 && propertyType.inString === "Val") {
        console.log("being there")
        throw new Error("property value cannot have children.")
    }
    let childLayerIndex = ([0,1,2].includes(layerIndex))? layerIndex + 1 : layerIndex
    let defType = Voc.layers[childLayerIndex].inString + relationType.inString + propertyType.inString

    return defType
}

function getChildren(id, childrenDefType){
    const children = getBulk([childrenDefType()],-1, 0, filterItems, {parentId: id})
    return children
}

function getRelsThisIsTargetOf(id, defType){
    return getBulk([defType + Voc.relationTypes.exRel.inString], - 1, 0, filterItems, {target: id})
}

function getRelsThisIsSourceOf(id, defType){
    return getBulk([defType + Voc.relationTypes.inRel.inString], - 1, 0, filterItems, {target: id})
}

function getTargetId(koi, item){
    if(koi !== "relation") return null
    else if (item.hasOwnProperty("target")) return item.target
    else throw new Error("target is missing in item.")
}

function getSourceId(koi, item){
    if(koi !== "relation") return null
    else if (item.hasOwnProperty("source")) return item.source
    else throw new Error("source is missing in item.")
}

module.exports = {IdController}