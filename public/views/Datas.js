import Graph from "../components/graph/Graph.js";
import FilterBox from "../components/filter/FilterBox.js";

import Actions from "../store/Actions.js";
import { getDataAsGraph, setupToolBar } from "../components/table/dataRendererHelper.js";

export default class Datas {
  constructor() {
    document.title = "Data";
    this.returnRenderFunc = getDataAsGraph;
    this.view = "datas";
  }
  async getTemplate() { return await this.returnRenderFunc("datas") }
  async setupToolBar() { return setupToolBar("datas") }
}
