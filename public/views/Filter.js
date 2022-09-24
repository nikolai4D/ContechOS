import Graph from "../components/graph/Graph.js";
import FilterBox from "../components/filter/FilterBox.js";

import Actions from "../store/Actions.js";
import { getDataAsGraph, setupToolBar } from "../components/table/dataRendererHelper.js";
import {Intersection} from "../store/Store/Intersection.js";

export default class Filter {
    constructor() {
        document.title = "Props";
        this.returnRenderFunc = getDataAsGraph;
        this.view = "props";
        this.ViewHasRenderControl = true;
        // sessionStorage.setItem("checkedBoxes",[[],[],[],[]])
        /*
        [ // Array of layers, ordered by index
    [ //Definition layer
        {
            parentId: null, //null for definition layer
            itemsIds: []
        },
        {
            parentId: null,
            itemsIds: []
        },
    ],
    [ //Object layer
        {
            parentId: "cd_1",
            itemsIds: ["co_1", "co_2"]
        },
        {
            parentId: "cd_2", 
            itemsIds: ["co_3", "co_4"]
        },
    ],
    [ // Type layer
    ],
    [ // Instance Layer
    ],
]
        */
    }

    async getTemplate() { 
        const intersectedData = await this.IntersectionMock(sessionStorage.getItem("checkedBoxes"));
        // const intersectedData = await Intersection(sessionStorage.getItem("checkedBoxes"));

        sessionStorage.setItem("props", JSON.stringify([{nodes: intersectedData[0] , rels: intersectedData[2] }]));
        const mainAppNodes = await this.returnRenderFunc("props")
        const filterBoxNodes = await FilterBox(intersectedData[0], intersectedData[1])
        return [mainAppNodes, filterBoxNodes] 
    }

    async setupToolBar() { return setupToolBar("props") }
    async IntersectionMock(checkedNodes){ 
        await Actions.GETALL("props");
        let nodes,
            rels = [];
        let graphJsonData = await JSON.parse(sessionStorage.getItem("props"));
        
        nodes = graphJsonData[0].nodes;
        rels = graphJsonData[0].rels;
        // Hey, so the output of the filter function will be [availableNodes, checkedNodes, RelationsBetweenNodes]
        // three arrays containing object (like the objects logged in the console when you click on a node or a relation)
        // available nodes are all the nodes displayed in the menu box. And checkedNodes are the same as in the graph.
        return [nodes, [nodes[0]], rels];
    }
}