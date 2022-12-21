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

    async ADD_NODE_REL_TO_SESSION(view, type, recordJson, defTypeTitle, attrs, prevView=false) {
            const recordsInView = JSON.parse(sessionStorage.getItem(view));

            // nodes that can have "has parent" rels
            if (
                defTypeTitle === "propKey" ||
                defTypeTitle === "propVal" ||
                defTypeTitle === "typeData" ||
                defTypeTitle === "configObj" ||
                defTypeTitle === "instanceData"
              ) {

            // previous view can't have "has parent" rel for type data
              if (prevView && defTypeTitle === "typeData") return
              
              let newParentRel = await this.getNewParentRel(recordJson, attrs);
              recordsInView[0].rels.push(newParentRel);
            }
            recordsInView[0][type].push(recordJson);
            sessionStorage.setItem(view, JSON.stringify(recordsInView));
          }

    async getNewParentRel(recordJson, attrs) {
        let source = recordJson.id;
        let target = await attrs.parentId;
        let rel = {
            id: `${source}_${target}`,
            source,
            target,
            title: "has parent",
        };
        return rel;
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

    async ADD_REL_TO_TREE(newRel) {
        let tree = State.treeOfNodes;

        let sourceNode = tree.getNodeById(newRel.source)
        let targetNode = tree.getNodeById(newRel.target)
        sourceNode.setRelations([newRel])
        targetNode.setRelations([newRel])
        await tree.shake()

    }

    async UPDATE_NODE_IN_TREE(editedNode){

        let tree = State.treeOfNodes;
        let node = tree.getNodeById(editedNode.id)
        node.title = editedNode.title;
        if (node.propKeys) node.propKeys = editedNode.propKeys;
        if (node.props) node.props = editedNode.props;
        if (node.instanceDataPropKeys) node.instanceDataPropKeys = editedNode.instanceDataPropKeys;
        if (node.typeDataPropKeys) node.typeDataPropKeys = editedNode.typeDataPropKeys;
        await tree.shake() 

    }

    async DELETE_NODE_FROM_TREE(id){

        let tree = State.treeOfNodes;
        let node = tree.getNodeById(id)
        node.deleteTreeNode()
   }
}



export default new Mutations();

