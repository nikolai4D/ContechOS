import Graph from "../components/graph/Graph.js";
import {FilterBox} from "../components/filter/FilterBox.js";
import {checkFilter, setFilterBoxCallback} from "../components/filter/filterFunctions.js";

import Actions from "../store/Actions.js";
import { renderDataAsGraph, setupToolBar, renderDataAsTable } from "../components/table/dataRendererHelper.js";
import {State} from "../store/State.js";
import {createHtmlElementWithData} from "../components/DomElementHelper.js";

export default class Filter {
    constructor() {
        document.title = "Filter";
        this.returnRenderFunc = renderDataAsGraph;
        this.view = "filter";
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
        let rowDiv = createHtmlElementWithData("div", {"class": "row"})
        let firstColumnDiv = createHtmlElementWithData("div", {"class": "col-sm", "id": "filterbox-grid-container-id"})
        rowDiv.appendChild(firstColumnDiv)
        let secondColumnDiv = createHtmlElementWithData("div", {"class": "col-lg", "id": "data-display-grid-container-id"})
        rowDiv.appendChild(secondColumnDiv)

        const dataNodeAndRedrawFunc = await this.returnRenderFunc("filter")
        let filterBox = await FilterBox()
        setFilterBoxCallback(firstColumnDiv, filterBox, dataNodeAndRedrawFunc[1])
        firstColumnDiv.appendChild(filterBox)
        secondColumnDiv.appendChild(dataNodeAndRedrawFunc[0])
        return [rowDiv]
    }

    async displayDataAndFilter(firstColumnDiv, secondColumnDiv) {
        const dataNodeAndRedrawFunc = await this.returnRenderFunc("filter")
        let filterBox = await FilterBox()
        setFilterBoxCallback(firstColumnDiv, filterBox, dataNodeAndRedrawFunc[1])
        firstColumnDiv.innerHTML = ""
        firstColumnDiv.appendChild(filterBox)
        secondColumnDiv.innerHTML = ""
        secondColumnDiv.appendChild(dataNodeAndRedrawFunc[0])
    }

    async setupToolBar() { return setupToolBar( 
        () => {
            this.returnRenderFunc = renderDataAsGraph;
            this.displayDataAndFilter(
                document.querySelector("#filterbox-grid-container-id"),
                document.querySelector("#data-display-grid-container-id"));},
        () =>  {
            this.returnRenderFunc = renderDataAsTable;
            this.displayDataAndFilter(
                document.querySelector("#filterbox-grid-container-id"),
                document.querySelector("#data-display-grid-container-id"));})}

}