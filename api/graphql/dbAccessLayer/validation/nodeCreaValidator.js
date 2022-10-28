const {idValidator} =  require("./idValidator")
const {voc} = require("../voc");
const { v4: uuidv4 } = require("uuid");

function nodeCreaValidator(params){
    this.parentIdData = getParentIdData(params.parentId)
    this.layerIndex = getLayerIndex(this.parentIdData)

    this.defType = voc.layers[this.layerIndex].inString
    this.id = getId(this.layerIndex)

    this.formattedParams = getFormattedParams(this.parentIdData)
}

function getParentIdData(parentId){
    if(parentId === null || parentId === undefined) return null
    let parentData = new idValidator(parentId)

    if(parentData.kindOfItem !== "node") throw new Error("Node creation interrupted: parent must be a node")
    else return parentData
}

function getLayerIndex(parent){
    if(parent === null) return 0
    else return parent.layerIndex +1
}

function getId(layerIndex){

    return voc.layers[layerIndex].abbr + "_" + uuidv4()
}

function getFormattedParams(parent){
    if(parent !== null) return {parentId: parent.id}
    else return {}
}

module.exports = { nodeCreaValidator }