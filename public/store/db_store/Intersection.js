import {dbStore} from "./dbStore";

function Checked(id, data, layer, children, relatedNodes, relations){
    this.id = id
    this.data = data
    this.layer = layer
    this.children = children
    this.relNodes = relatedNodes
    this.relations = relations
}

function Layer(checkedNodes, availableNodes){
    this.checkedNodes = checkedNodes
    this.availableNodes = availableNodes
}

async function filter(frontData = [[],[],[],[]]) {
    const checkedNodesToReturn = []
    const availableNodesToReturn = []
    const relationsToReturn = []

    // General idea:
    const layers = []

    // For layer 0,
    // -> get all the def nodes,
    const defNodes =await dbStore.getRepoContent("configDef")
    availableNodesToReturn.push(defNodes)

    // -> get the layer 1 available nodes (all the children of checked nodes on layer 1)
    const checkedNodes = []
    for (let node in frontData[0][0].items) {
        const children = await dbStore.getChildren(node.id)
        const {relNodes, rels} = await dbStore.getRelatedNodesAndRels(node.id)
        const data = await dbStore.getItem(node.id)
        checkedNodes.push(new Checked(node.id, data, 0, children, relNodes, rels))
    }
    for(let checkedNode of checkedNodes){
        checkedNodesToReturn.push(checkedNode.data)
    }
    layers.push(new Layer(checkedNodes))


    // -> filter the available nodes of layer 1 based on their parents relations and their own relations
    for(let node in checkedNodes){  // For each checked node on layer A
       const remainingChildren = node.children // Get the children on layer B
       for ( let relNode in node.relNodes){
           if(checkedNodes.includes(el => el.id === relNode.id)) { // If the related node is also checked
               const rel = node.relations.find(rel => rel.target === relNode.id || rel.source === relNode.id) // Get the relation between the two nodes
               relationsToReturn.push
               for ( let child in remainingChildren){
                   const {childRelsNodes, childRels} = await dbStore.getRelatedNodesAndRels(child.id)
                  if ((!childRelsNodes.includes( child => relNode.children.includes(child)))){ // Then their children should be related
                      // Otherwise child is no longer available
                      remainingChildren.splice(remainingChildren.indexOf(child), 1, null) // replace item with null
                    }
                }
           }

       const filteredChildren = remainingChildren.filter(child => child !== null)
       layers.push(new Layer(checkedNodes, filteredChildren)) // Add the below layer to the layers array
    }

   // for layers 1 && 2
    for (let index in [1,2]) {
        const frontLayer = frontData[index]
        const checkedNodes = []
        const layer = layers[index]
        for (let node in frontLayer.items){
            if(layer.availableNodes.includes(node)){
                const {relNodes, rels} = await dbStore.getRelatedNodesAndRels(node.id)
                checkedNodes.push(new Checked(node.id, frontLayer, relNodes, rels))
            }
        }
    }

            // -> get the layer available nodes (all the children of checked nodes on layer 1)

            // -> filter the available nodes of layer based on their parents relations and their own relations

            // filter:
            // get related nodes
            // for related nodes that are checked, verify that children share at least one relation.

    }
}