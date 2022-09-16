const {IdController} =  require("./IdController")
const {Voc} = require("../Voc");
const { v4: uuidv4 } = require("uuid");

function NodeCreaController(params){
    this.parentIdData = getParentIdData(params.parentId)

    this.layerIndex = getLayerIndex(this.parentIdData)
    this.defType = Voc.layers[this.layerIndex].inString
    this.id = getId(this.layerIndex)

    this.formattedParams = getFormattedParams(this.parentIdData)
}

function getParentIdData(parentId){
    if(parentId === null || parentId === undefined) return null
    let parentData = new IdController(parentId)

    if(parentData.kindOfItem !== "node") throw new Error("Node creation interrupted: parent must be a node")
    else return parentData
}

function getLayerIndex(parent){
    if(parent === null) return 0
    else return parent.layerIndex +1
}

function getId(layerIndex){
    return Voc.layers[layerIndex].abbr + "_" + uuidv4()
}

function getFormattedParams(parent){
    if(parent !== null) return {parentId: parent.id}
    else return {}
}

module.exports = { NodeCreaController }