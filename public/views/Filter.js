import Graph from "../components/graph/Graph.js";
import FilterBox from "../components/filter/FilterBox.js";

import Actions from "../store/Actions.js";
import { getDataAsGraph, setupToolBar } from "../components/table/dataRendererHelper.js";
import {Intersection} from "../store/Store/Intersection.js";

export default class Filter {
    constructor() {
        document.title = "Filter";
        this.returnRenderFunc = getDataAsGraph;
        this.view = "filter";
        this.ViewHasRenderControl = true;
    }

    async getTemplate() { 
        //const intersectedData = await Intersection();
        const intersectedData = await this.IntersectionMock(sessionStorage.getItem("checkedBoxes"));

        sessionStorage.setItem("props", JSON.stringify([{nodes: intersectedData[1] , rels: intersectedData[2] }]));
        const mainAppNodes = await this.returnRenderFunc("props")
        const filterBoxNodes = await FilterBox(intersectedData[0], intersectedData[1])
        return [mainAppNodes, filterBoxNodes] 
    }

    async setupToolBar() { return setupToolBar("props") }
    async IntersectionMock(checkedNodes){ 
        await Actions.GETALL("props");
        let nodes, rels = [];
        let graphJsonData = await JSON.parse(sessionStorage.getItem("props"));
        
        nodes = graphJsonData[0].nodes;
        rels = graphJsonData[0].rels;
        // Hey, so the output of the filter function will be [availableNodes, checkedNodes, RelationsBetweenNodes]
        // three arrays containing object (like the objects logged in the console when you click on a node or a relation)
        // available nodes are all the nodes displayed in the menu box. And checkedNodes are the same as in the graph.
        return [nodes, [nodes[0]], rels];
    }
}