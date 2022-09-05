import { getDataAsGraph, setupToolBar} from "../helpers/dataRendererHelper.js";

export default class Datas {
  constructor() {
    document.title = "Data";
    this.returnRenderFunc = getDataAsGraph;
    this.view = "datas";
  }
  async getTemplate() { return this.returnRenderFunc("datas") }
  async setupToolBar() { return setupToolBar("datas") }
}
