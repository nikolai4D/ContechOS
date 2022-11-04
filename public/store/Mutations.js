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

        const layers = ["configDef", "configObj", "typeData", "instanceData"]
        const nodeLayer = layers.indexOf(newNode.defType)
        if (nodeLayer === -1) return;

        let tree = State.treeOfNodes;
        let parentNode = null;
        
        if (newNode.parentId) { 
             parentNode = tree.getNodeById(newNode.parentId)
             let fructified = tree.fructify([newNode], nodeLayer, parentNode)[0]
             fructified.selected = true;
             parentNode.children.push(fructified);
        }
        else {
            let fructified = tree.fructify([newNode], nodeLayer, parentNode)[0]
            fructified.selected = true;
            tree.tree.push(fructified);
        }

        await tree.shake()
    }
    async DELETE_NODE_FROM_TREE(id){

        let tree = State.treeOfNodes;
        let node = tree.getNodeById(id)
        node.deleteTreeNode()
   }
}



export default new Mutations();

