import Graph from "../components/graph/Graph.js";
import {FilterBox} from "../components/filter/FilterBox.js";

import Actions from "../store/Actions.js";
import { renderDataAsGraph, setupToolBar } from "../components/table/dataRendererHelper.js";
import {State} from "../store/State.js";
import {createHtmlElementWithData, appendChildsToSelector} from "../components/table/dataRendererHelper.js";

export default class Filter {
    constructor() {
        document.title = "Filter";
        this.returnRenderFunc = renderDataAsGraph;
        this.view = "filter";
        this.ViewHasRenderControl = true;
        sessionStorage.setItem("checkedBoxes",[[],[],[],[]])
    }
    async getTemplate() {
        const tree = State.treeOfNodes
        await tree.ensureInit()

        tree.visibleRelations.map(rel => {
            rel.source = rel.sourceId
            rel.target = rel.targetId
            return rel
        })

        sessionStorage.setItem("filter", JSON.stringify([{nodes: tree.selectedNodesData , rels: tree.visibleRelations }]));
        let gridDiv = createHtmlElementWithData("div")
        let rowDiv = createHtmlElementWithData("div", {"class": "row"})
        gridDiv.appendChild(rowDiv)
        let firstColumnDiv = createHtmlElementWithData("div", {"class": "col-md", "id": "filterbox-grid-container-id"})
        rowDiv.appendChild(firstColumnDiv)
        let secondColumnDiv = createHtmlElementWithData("div", {"class": "col-md", "id": "data-display-grid-container-id"})
        rowDiv.appendChild(secondColumnDiv)

        const mainAppNodes = await this.returnRenderFunc("filter", firstColumnDiv)
        //dataDisplayDiv.appendChild(mainAppNodes[0])
        //filterboxDiv.appendChild(mainAppNodes[1])
        firstColumnDiv.appendChild(mainAppNodes[1])
        secondColumnDiv.appendChild(mainAppNodes[0])
        //const filterBoxNodes = await FilterBox()
        return [gridDiv]
    }
    async setupToolBar() { return setupToolBar("filter",await FilterBox()) }

}