import {Store} from "./Store/dbStore.js";
import {Tree} from "./Store/TreeOfNodes.js";

export const State = {
    test: "test",
    clickedObj: null,
    store: new Store(),
    treeOfNodes: await new Tree(), // A tree of nodes simplified items, each item have id, title, checked and children.
    selectedNodes: []
};