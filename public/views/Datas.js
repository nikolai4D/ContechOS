import Actions from "../store/Actions.js";
import { renderDataAsGraph, setupToolBar } from "../components/table/dataRendererHelper.js";

export default class Datas {
  constructor() {
    document.title = "Data";
    this.returnRenderFunc = renderDataAsGraph;
    this.view = "datas";
  }
  async getTemplate() { 
    await Actions.GETALL("datas")
    return (await this.returnRenderFunc("datas"))[0]
  }
}
