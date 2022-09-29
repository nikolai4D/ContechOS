import {queryDefinitions} from "./Store/dbStore.js";
import {Tree} from "./Store/Tree.js";

export const State = {
    test: "test",
    clickedObj: null,
    treeOfNodes: new Tree(), // A tree of nodes simplified items, each item have id, title, checked and children.
    relations: [], //relation items, treeNodes refers to it.
    graphObject: null,
};

