import {FilterBox} from "../components/filter/FilterBox.js";
import {setFilterBoxCallback} from "../components/filter/filterFunctions.js";

import { renderDataAsGraph, setupToolBar, renderDataAsTable } from "../components/table/dataRendererHelper.js";
import {State} from "../store/State.js";
import {createHtmlElementWithData} from "../components/DomElementHelper.js";

export default class Filter {
    constructor() {
        document.title = "Filter";
        this.returnRenderFunc = renderDataAsGraph;
        this.view = "filter";
        this.isInTableView = false;
    }
    async getTemplate() {
        const tree = State.treeOfNodes
        await tree.ensureInit()

        const {nodes, relations} = tree.getVisibleData()
        sessionStorage.setItem("filter", JSON.stringify([{nodes: nodes , rels: relations }]));
        let rowDiv = createHtmlElementWithData("div", {"class": "row"})
        let firstColumnDiv = createHtmlElementWithData("div", {"class": "float-right", "id": "filterbox-grid-container-id"})
        rowDiv.appendChild(firstColumnDiv)
        let secondColumnDiv = createHtmlElementWithData("div", {"class": "", "id": "data-display-grid-container-id"})
        rowDiv.appendChild(secondColumnDiv)

        const dataNodeAndRedrawFunc = await this.returnRenderFunc("filter")
        let filterBox = await FilterBox()
        setFilterBoxCallback(filterBox, dataNodeAndRedrawFunc[1])
        firstColumnDiv.appendChild(dataNodeAndRedrawFunc[0])
        secondColumnDiv.appendChild(filterBox)
        //await this.setupToolBar()
        return [rowDiv]
    }

    async displayDataAndFilter(firstColumnDiv, secondColumnDiv, firstClass, secondClass) {
        const dataNodeAndRedrawFunc = await this.returnRenderFunc("filter")
        let filterBox = await FilterBox()
        setFilterBoxCallback(filterBox, dataNodeAndRedrawFunc[1])
        firstColumnDiv.innerHTML = ""
        firstColumnDiv.className = firstClass
        firstColumnDiv.appendChild(dataNodeAndRedrawFunc[0])
        secondColumnDiv.innerHTML = ""
        secondColumnDiv.className = secondClass
        secondColumnDiv.appendChild(filterBox)
        await this.setupToolBar()
    }

    async setupToolBar() { return setupToolBar( 
        () => {
            this.returnRenderFunc = renderDataAsGraph;
            this.isInTableView = false;
            this.displayDataAndFilter(
                document.querySelector("#filterbox-grid-container-id"),
                document.querySelector("#data-display-grid-container-id"),
                "float-right",
                "");},
        () =>  {
            this.returnRenderFunc = renderDataAsTable;
            this.isInTableView = true;
            this.displayDataAndFilter(
                document.querySelector("#filterbox-grid-container-id"),
                document.querySelector("#data-display-grid-container-id"),
                "col order-2",
                "col order-1");},
        () =>  this.isInTableView)}

}