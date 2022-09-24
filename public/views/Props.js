import Graph from "../components/graph/Graph.js";
import Filter from "../components/filter/Filter.js";

import Actions from "../store/Actions.js";
import { getDataAsGraph, setupToolBar } from "../components/table/dataRendererHelper.js";

export default class Props {
    constructor() {
        document.title = "Props";
        this.returnRenderFunc = getDataAsGraph;
        this.view = "props";
        //this.ViewHasRenderControl = true;
    }
    async getTemplate() { return [await this.returnRenderFunc("props"), await Filter("props")] }
    async setupToolBar() { return setupToolBar("props") }
}