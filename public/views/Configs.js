import { renderDataAsGraph, setupToolBar } from "../components/table/dataRendererHelper.js";
import Actions from "../store/Actions.js";

export default class Configs {
    constructor() {
        document.title = "Config";
        this.returnRenderFunc = renderDataAsGraph;
        this.view = "configs";
    }
    async getTemplate() { 
        await Actions.GETALL("configs")
        return (await this.returnRenderFunc("configs"))[0]
    }
}
