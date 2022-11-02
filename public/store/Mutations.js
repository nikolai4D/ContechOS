import { State } from "./State.js"
class Mutations {
    async SET_STATE(view, records) {
        let data = await JSON.parse(sessionStorage.getItem(`${view}`));
        if (data == null) {
            if (!Array.isArray(records)) {
                data = []
                data.push(records)
            }
            else {
                data = records;
            }
            sessionStorage.setItem(`${view}`, JSON.stringify(data));
        }
    }

    async ADD_NODE_TO_STATE(view, records) {
        let data = await JSON.parse(sessionStorage.getItem(`${view}`))

        if (await data == null) {
            data = []
        }
        data[0]["nodes"].push(records);
        sessionStorage.setItem(`${view}`, JSON.stringify(data));
    }

    async ADD_NODE_TO_TREE(newNode) {

        let tree = State.treeOfNodes;
        let parentNode = tree.getNodeById(newNode.parentId)
        let fructified = tree.fructify([newNode], 2, parentNode)[0]
        fructified.selected = true;
        parentNode.children.push(fructified);
        await tree.shake()

        console.log(fructified)
        console.log(tree)
        console.log(newNode)
        console.log(parentNode)


        //  pushNodeToTree(State.treeOfNodes.tree)



        // getNodeById


        // function pushNodeToTree(anArray) {

        //     anArray.forEach(existingNode => {
        //         if (existingNode.id === newNode.parentId){
        //             existingNode.children.push(newNode);
        //             State.treeOfNodes.selectedRelations.push({
        //                 sourceId: newNode.id,
        //                 source: newNode.id,
        //                 targetId: newNode.parentId, 
        //                 target: newNode.parentId, 
        //                 title:"has parent",
        //             })
        //             return;
        //         }
        //         else pushNodeToTree(existingNode.children)
        //     });
        //     return anArray;
        // }


    }
}



export default new Mutations();

