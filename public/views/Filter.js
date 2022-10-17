import {FilterBox} from "../components/filter/FilterBox.js";
import {setFilterBoxCallback, addFunctionsToFilterbox} from "../components/filter/filterFunctions.js";

import {renderDataAsGraph, renderDataAsTable } from "../components/table/dataRendererHelper.js";
import {State} from "../store/State.js";
import {createHtmlElementWithData} from "../components/DomElementHelper.js";

export default class Filter {
    constructor() {
        document.title = "Filter";
        this.returnRenderFunc = renderDataAsGraph;
        this.view = "filter";
        this.isInTableView = false;
        this.filterboxHeaderId = "#accordion-container-switch-modalbtn";
    }

    async getTemplate() {
        const tree = State.treeOfNodes
        await tree.ensureInit()

        const {nodes, relations} = tree.getVisibleData()
        sessionStorage.setItem("filter", JSON.stringify([{nodes: nodes , rels: relations }]));
        let rowDiv = createHtmlElementWithData("div", {"class": "row m-0 p-0"})
        let firstColumnDiv = createHtmlElementWithData("div", {"class": "float-right m-0 p-0", "id": "filterbox-grid-container-id"})
        rowDiv.appendChild(firstColumnDiv)
        let secondColumnDiv = createHtmlElementWithData("div", {"class": "position-absolute", "id": "data-display-grid-container-id"})
        rowDiv.appendChild(secondColumnDiv)
        await this.displayDataAndFilter(firstColumnDiv, secondColumnDiv, "float-right", "position-absolute m-0 p-0");
        return [rowDiv]
    }

    async displayDataAndFilter(firstColumnDiv, secondColumnDiv, firstClass, secondClass) {
        const dataNodeAndRedrawFunc = await this.returnRenderFunc("filter")
        let filterBox = await FilterBox()
        await setFilterBoxCallback(filterBox, dataNodeAndRedrawFunc[1])
        firstColumnDiv.innerHTML = ""
        firstColumnDiv.className = firstClass
        firstColumnDiv.appendChild(dataNodeAndRedrawFunc[0])
        secondColumnDiv.innerHTML = ""
        secondColumnDiv.className = secondClass
        secondColumnDiv.appendChild(filterBox)
        await this.setupToolBar(firstColumnDiv, secondColumnDiv, secondColumnDiv.querySelector(this.filterboxHeaderId))
    }

    async setupToolBar(firstDiv, secondDiv, containerNode) { return addFunctionsToFilterbox(
        () => {
            this.returnRenderFunc = renderDataAsGraph;
            this.isInTableView = false;
            this.displayDataAndFilter(
                firstDiv,
                secondDiv,
                "float-right",
                "");},
        () =>  {
            this.returnRenderFunc = renderDataAsTable;
            this.isInTableView = true;
            this.displayDataAndFilter(
                firstDiv,
                secondDiv,
                "col order-2",
                "col order-1");},
        () =>  this.isInTableView,
        containerNode)}
}