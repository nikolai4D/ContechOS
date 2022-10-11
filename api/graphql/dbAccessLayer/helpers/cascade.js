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

    if(!(params.hasOwnProperty('intersect') && params.intersect === false)) {
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
        let parentRels = parentLayerRels.filter(rel => rel.source === parentNode.id || rel.target === parentNode.id)
        let childNodes = childLayerNodes.filter(childNode => childNode.parentId === parentNode.id)
        for (let childNode of childNodes){
            let isValid = true
            let childRels = childLayerRels.filter(rel => rel.source === childNode.id || rel.target === childNode.id)
            for (let parentRel of parentRels){
                let matchingChildRel = childRels.find(rel => rel.parentId === parentRel.id)
                if(!matchingChildRel) {
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
    let relevantRels = childLayerRels.filter(rel => externalIntersect.find(node => node.id === rel.source || node.id === rel.target))
    for (let childNode of childLayerNodes){
        if(externalIntersected.find(node => node.id === childNode.id)) continue
        if(relevantRels.find(rel => rel.source === childNode.id || rel.target === childNode.id && parentLayerRels.find(pRel => pRel.id === rel.parentId))) array.push(childNode)
    }
    return array
}

module.exports = cascade