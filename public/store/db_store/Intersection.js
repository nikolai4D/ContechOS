import {dbStore} from "./dbStore";

export function Intersection(viewData){

    let graphNodes
    let graphRelation
    let checkboxesNodes // CheckBoxes available for the user to select

    let defData = viewData[0]
    const defDataRelations = []//Todo rels

    return {}
}

// async function filter(viewData) {
//     const layers = []
//     const checked = []
//     const displayedRelations = []
//     const tickables = []
//
//     for (let layer in layers) {
//         const availableNodes = []
//         const availableRelations = []
//
//         const checked = []
//         const nodesToDisplay = []
//         const relsToDisplay = []
//
//         if (layer === 0) {
//             availableNodes.push(await dbStore.getRepoContent("configDef"))
//             checked.push(layers[0][0].items)
//             layers.push([availableNodes, availableRelations, checked])
//         }
//
//     }
// }
//
// const layer = {
//     parentId: "cd_iiiii",
//     items: ["co_sddf", "co_sdfsd"],
// }

// async function filter(frontData) {
//     const layers = [[],[], [], []]
//
//     for (let frontLayer in frontData) {
//         const availableNodes = []
//         const availableRels = []
//         const added = []
//
//         if (frontLayer === 0) {
//             availableNodes.push(await dbStore.getRepoContent("configDef"))
//             availableRels.push(...(await dbStore.getRepoContent("configDefExternalRels")), ...(await dbStore.getRepoContent("configDefInternalRels")))
//             layers[0].push(availableNodes, availableRels, frontData[0].items)
//             continue
//         }
//
//         for(let parent of frontLayer){
//             const parentId = parent.parentId
//             const unfilteredChildren = await dbStore.getChildren(parentId)
//
//             // If parent have
//             for(let child of unfilteredChildren){
//                 const {relations, nodes} = await dbStore.getRelatedNodesAndRels(child.id)
//
//                 // compare with others in availableNodes, if their parentsIds are related children must be related.
//
//             }
//         }
//
//     }
// }

function Checked(id, layer, relatedNodes, relations){
    this.id = id
    this.layer = layer
    this.relatedNodes = relatedNodes
    this.relations = relations
}

function Layer(checkedNodes, availableNodes){
    this.checkedNodes = checkedNodes
    this.availableNodes = availableNodes
}

async function filter(frontData = [[],[],[],[]]) {
    const layers = []

    for (let frontLayer in frontData) {
        if (frontLayer === 0) {
            const availableNodes = await dbStore.getRepoContent("configDef")
            const checkedNodes = []

            for(let node in frontData[0][0].items){
                const {relNodes, rels} = await dbStore.getRelatedNodesAndRels(node.id)
                checkedNodes.push(
                    new Checked(
                        node.id, frontLayer, relNodes, rels))
            }
            layers.push(new Layer(checkedNodes, availableNodes))
        }
        else {
            //First we get the available nodes
            const availableNodes= []
            const checkedNodes = []
            const checkedParentRepo = []


            for(let parentRepo in frontData[frontLayer]){

                // We need to know what are the possible relations to a node
                // -> check the relations of its parent
                // -> If some checked nodes parents have relations to the considered node but the children aren't related themselves, hide thee considered node.



                const relatedParentIds = layers[frontLayer-1].checkedNodes.filter(node => node.id === parentRepo.id).relatedNodes
                //
                // if(checkedNodes.find)
            }


            // General idea:

            const layers = []
            for (let frontLayer in frontData) {
                // For layer 0,
                // -> get all the def nodes,
                if (frontLayer === 0) {
                    const availableNodes = await dbStore.getRepoContent("configDef")
                    // -> get the layer 1 available nodes (all the children of checked nodes on layer 1)
                    const childrenAvailableNodes= []
                    for(let node in frontData[0][0].items){
                        const children = await dbStore.getChildren(node.id)
                        childrenAvailableNodes.push({parentId.children)
                    }

                    // -> filter the available nodes of layer 1 based on their parents relations and their own relations
                    // for layers 1 && 2
                    // -> get the layer available nodes (all the children of checked nodes on layer 1)
                    // -> filter the available nodes of layer based on their parents relations and their own relations

                    // filter:
                    // get related nodes
                    // for related nodes that are checked, verify that children share at least one relation.

                }
            }
        }
}