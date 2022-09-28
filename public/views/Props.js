import Actions from "../store/Actions.js";
import { renderDataAsGraph, setupToolBar } from "../components/table/dataRendererHelper.js";

export default class Props {
    constructor() {
        document.title = "Props";
        this.returnRenderFunc = renderDataAsGraph;
        this.view = "props";
        //this.ViewHasRenderControl = true;
    }
    async getTemplate() { 
        console.log("props")
        await Actions.GETALL("props")
        return await this.returnRenderFunc("props")
    }
    async setupToolBar() { return setupToolBar("props") }
}