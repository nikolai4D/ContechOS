import FilterBox from "../components/filter/FilterBox.js";
import { renderDataAsGraph, setupToolBar } from "../components/table/dataRendererHelper.js";
import {State} from "../store/State.js";

export default class Filter {
    constructor() {
        document.title = "Filter";
        this.returnRenderFunc = renderDataAsGraph;
        this.view = "filter";
        this.ViewHasRenderControl = true;
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

        const mainAppNodes = await this.returnRenderFunc("filter")
        const filterBoxNodes = await FilterBox()
        return [mainAppNodes, filterBoxNodes]
    }
    async setupToolBar() { return setupToolBar("filter",await FilterBox()) }

}