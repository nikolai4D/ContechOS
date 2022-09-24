import { getDataAsGraph, setupToolBar } from "../components/table/dataRendererHelper.js";

export default class Configs {
    constructor() {
        document.title = "Config";
        this.returnRenderFunc = getDataAsGraph;
        this.view = "configs";
    }
    async getTemplate() { return await this.returnRenderFunc("configs")}
    async setupToolBar() { return setupToolBar("configs") }
}
