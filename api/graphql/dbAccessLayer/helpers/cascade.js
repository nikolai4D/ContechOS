const { getItems } = require("../../dbAccessLayer/crud/read")

// ToDo: optimize. Refactor.

async function cascade(params = {}) {

    let configDefNodes = await getAllRequiredNodesFromLayer("configDef", params.configDef)
    let configObjNodes = await getAllRequiredNodesFromLayer("configObj", params.configObj)
    let typeDataNodes = await getAllRequiredNodesFromLayer("typeData", params.typeData)
    let instanceDataNodes = await getAllRequiredNodesFromLayer("instanceData", params.instanceData)
    let configDefExternalRels = await getRelsFromNodes(configDefNodes, "configDef", "ExternalRel")
    let configDefInternalRels = await getRelsFromNodes(configDefNodes, "configDef", "InternalRel")
    let configObjExternalRels = await getRelsFromNodes(configObjNodes, "configObj", "ExternalRel")
    let configObjInternalRels = await getRelsFromNodes(configObjNodes, "configObj", "InternalRel")
    let typeDataExternalRels = await getRelsFromNodes(typeDataNodes, "typeData", "ExternalRel")
    let typeDataInternalRels = await getRelsFromNodes(typeDataNodes, "typeData", "InternalRel")
    let instanceDataExternalRels = await getRelsFromNodes(instanceDataNodes, "instanceData", "ExternalRel")
    let instanceDataInternalRels = await getRelsFromNodes(instanceDataNodes, "instanceData", "InternalRel")

    if(params.hasOwnProperty('intersect') && params.intersect === false) {
        configObjNodes = IntersectLayer(configDefNodes, configObjNodes, configDefExternalRels, configObjExternalRels, configDefInternalRels, configObjInternalRels)
        typeDataNodes = IntersectLayer(configObjNodes, typeDataNodes, configObjExternalRels, typeDataExternalRels, configObjInternalRels, typeDataInternalRels)
        instanceDataNodes = IntersectLayer(typeDataNodes, instanceDataNodes, typeDataExternalRels, instanceDataExternalRels, typeDataInternalRels, instanceDataInternalRels)
    }


    return {configDefNodes, configObjNodes, typeDataNodes, instanceDataNodes}
}

async function getAllRequiredNodesFromLayer(layerName, params = {}) {
    let array = []

    if(params.title !== undefined) for (let title of params.title) {
        array.push(...await getItems({title: title, kindOfItem: "node", defType: layerName}))
    }
    if(params.id !== undefined) for (let id of params.id) {
        let nodes = await getItems({id: id, kindOfItem: "node", defType: layerName})
        for (let node of nodes) if(!array.find(el => el.id === node.id)) array.push(node)
    }
    if(layerName === "configDef") return array
    if(params.parentId !== undefined) for (let parentId of params.parentId) {
        let nodes = await getItems({parentId: parentId, kindOfItem: "node", defType: layerName})
        for (let node of nodes) if(!array.find(el => el.id === node.id)) array.push(node)
    }
    return array
}

async function getRelsFromNodes(nodeArray, layerName, relType) {
    let array = []
    for (let node of nodeArray) {
        let rels = await getItems({targetId: node.id, kindOfItem: "relationship", defType: layerName + relType})
        if(rels )for (let rel of rels){
            if(nodeArray.find(el => el.id === rel.source)) {
                array.push(rel)
            }
        }
    }
    return array
}

function IntersectLayer(parentLayerNodes, childLayerNodes, parentLayerExternalRels, childLayerExternalRels, parentLayerInternalRels, childLayerInternalRels) {
    let externalIntersected = externalIntersect(parentLayerNodes, childLayerNodes, parentLayerExternalRels, childLayerExternalRels)
    let internalIntersected = internalIntersect(parentLayerNodes, childLayerNodes, parentLayerInternalRels, childLayerInternalRels, externalIntersected)
    return externalIntersected.concat(internalIntersected)
}

function externalIntersect(parentLayerNodes, childLayerNodes, parentLayerRels, childLayerRels) {
    let array = []
    for(let parentNode of parentLayerNodes){
        let parentRels = parentLayerRels.filter(rel => rel.sourceId === parentNode.id || rel.targetId === parentNode.id)
        let childNodes = childLayerNodes.filter(childNode => childNode.parentId === parentNode.id)
        for (let childNode of childNodes){
            let isValid = true
            let childRels = childLayerRels.filter(rel => rel.sourceId === childNode.id || rel.targetId === childNode.id)
            for (let parentRel of parentRels){
                if(childRels.find(el => el.parentId === parentRel.id) === undefined) {
                    isValid = false
                    break
                }
            }
            if(isValid) array.push(childNode)
        }
    }
    return array
}

function getOtherNodeFromRel(rel, node){
    if(rel.sourceId === node.id) return rel.targetId
    else return rel.sourceId
}

function internalIntersect(parentLayerNodes, childLayerNodes, parentLayerRels, childLayerRels, externalIntersected) {
    let array = []
    for(let parentNode of parentLayerNodes){
        let parentRels = parentLayerRels.filter(rel => rel.sourceId === parentNode.id || rel.targetId === parentNode.id)
        let childNodes = childLayerNodes.filter(childNode => childNode.parentId === parentNode.id)
        for (let childNode of childNodes){
            if(externalIntersected.find(el => el.id === childNode.id) !== undefined) continue
            let isValid = true
            let childRels = childLayerRels.filter(rel => rel.sourceId === childNode.id || rel.targetId === childNode.id && externalIntersected.find(el => el.id === getOtherNodeFromRel(rel, childNode)) !== undefined)
            for (let parentRel of parentRels){
                if(childRels.find(el => el.parentId === parentRel.id) === undefined) {
                    isValid = false
                    break
                }
            }
            if(isValid) array.push(childNode)
        }
    }
    return array
}

module.exports = cascade