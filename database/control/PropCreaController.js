const {IdController} = require("./IdController")
const {Voc} = require("../Voc");
const {v4} = require("uuid");

function PropCreaController(params){
    this.parent = getParent(params)
    this.propertyType = getPropertyType(this.parent)

    this.id = getId(this.propertyType)
    this.defType = getDefType(this.propertyType)
    this.formattedParams = getFormattedParams(this.parent)
}

function getParent(params){
    if(!params.hasOwnProperty("parentId")) return null
    const parent = new IdController(params.parentId)
    if (parent.layerIndex != 4) throw new Error("parent of property should belong to the layer prop (layerIndex 5).")
    return parent
}

function getPropertyType(parent){
    if(parent === null) return Voc.propertyTypes.pType
    else if (parent.propertyType.inString === "Type") return Voc.propertyTypes.pKey
    else if (parent.propertyType.inString === "Key") return Voc.propertyTypes.pValue
    else if (parent.propertyType.inString === "Type") throw new Error("Parent property cannot be of property type 'value'. Parentid: " + parent.id)
    else throw new Error("Property creation invalid: could not determine property type. parentId: " + parent.id)
}

function getFormattedParams(parent){
    if(parent !== null) return {parentId: parent.id}
    else return {}
}

function getId(propertyType){
    return "p" + propertyType.abbr + "_" + v4()
}

function getDefType(propertyType){
    return "prop" + propertyType.inString
}

module.exports = { PropCreaController }