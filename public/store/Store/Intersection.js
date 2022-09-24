import {State} from "../State.js";

function Checked(id, data, children, relatedNodes, relations){
    this.id = id
    this.data = data
    this.children = children
    this.relNodes = relatedNodes
    this.relations = relations
}


export async function Intersection(frontData = [[],[],[],[]]) {
    const store = State.store

    const checkedNodesToReturn = []
    const availableNodesToReturn = []
    const relationsToReturn = []

    // General idea:
    let availableNodes = await store.getDefinitionNodes("configDef")
    const boxNodes = availableNodes.map( el => {
        return {id: el.id, title: el.title, children: [], checked: frontData[0].includes(el.id)}
    })

    availableNodesToReturn.push(availableNodes)

    // -> get the layer 1 available nodes (all the children of checked nodes on layer 1)
    const {checkedNodes, checkToReturn} = narrowCheckedNodes(frontData[0], availableNodes)
    checkedNodesToReturn.push(checkToReturn)
    const {avNodes, rels} = await narrowChildren(checkedNodes)
    availableNodes = avNodes
    for(let avNode in availableNodes){
        findParentInBoxNodes(boxNodes, avNode.parentId, 0).children.push(avNode)
    }

    availableNodesToReturn.push(...avNodes)
    relationsToReturn.push(rels)


   // for layers 1 && 2
    for (let index in [1,2]) {
        const frontLayer = frontData[index]
        const checkedNodes = await narrowCheckedNodes(frontLayer, availableNodes)
        const {childAvNodes, rels} = await narrowChildren(checkedNodes)
        availableNodes = childAvNodes
        availableNodesToReturn.push(availableNodes)
        relationsToReturn.push(rels)
    }

    const {chNodes, chToReturn} = await narrowCheckedNodes(frontData[3], availableNodes)
    checkedNodesToReturn.push(chToReturn)
    for(let chNode in chNodes){
        for(let relNode in chNode.relNodes){
            const rel = chNode.relations.find(rel => rel.target === relNode.id)
            if(rel) relationsToReturn.push(rel)
        }
    }

    return [availableNodesToReturn, checkedNodesToReturn, relationsToReturn]
}

/**
 * filter the checked nodes present in the available nodes.
 * @param frontLayer
 * @param availableNodes
 * @returns {Promise<{checkedData: *[], narCheckedNodes: *[]}>}
 */
async function narrowCheckedNodes(frontLayer, availableNodes) {
    const narCheckedNodes = []
    const checkedData = []
    for (let itemGroup in frontLayer) {
        for (let node in itemGroup.items) {
            if (availableNodes.includes(node)) {
                const children = await State.store.getChildren(node.id)
                const rels = await State.store.getRelatedRels(node.id)
                const relNodes = getOtherNodesId(rels, node.id)
                const data = await State.store.getItem(node.id)
                narCheckedNodes.push(new Checked(node.id, children, relNodes, rels))
                checkedData.push(data)
            }
        }
    }
    return {narCheckedNodes, checkedData}
}

/**
 * filter the nodes children (lB) and give the relations (lA)
 * @param checkedNodes
 * @returns {Promise<*[][]>}
 */
async function narrowChildren(checkedNodes) {
    const relsToReturn = []
    const filteredChildren = []

    for (let node in checkedNodes) {
        const remainingChildren = node.children
        for (let relNode in node.relNodes) {
            if (checkedNodes.includes(el => el.id === relNode.id)) { // If the related node is also checked
                const rel = node.relations.find(rel => rel.target === relNode.id)
                if(rel) relsToReturn.push(rel)

                for (let child in remainingChildren) {
                    const childRelsNodes = await State.store.getRelatedRels(child.id)
                    if ((!childRelsNodes.includes(child => relNode.children.includes(child)))) {
                        remainingChildren.splice(remainingChildren.indexOf(child), 1, null) // replace item with null
                    }
                }
            }
            let filtChildren = remainingChildren.filter(el => el !== null)
            filteredChildren.push({parentId: filtChildren})

        }
    }

    return [filteredChildren, relsToReturn]
}

function getOtherNodesId(rels, nodeId){
    return rels.map(rel => rel.source === nodeId ? rel.target : rel.source)
}

function findParentInBoxNodes(boxNodes, parentId, parentLayer){
    for(let node in boxNodes){
        if(node.id === parentId){
            return node
        }
        else if(parentLayer > 0){
            for(let children in node.children){
                if(children.id === parentId){
                    return children
                }
                else if(parentLayer >1 ){
                    for(let children in node.children){
                        if(children.id === parentId){
                            return children
                        }
                    }
                }
            }
        }
    }
}
