import { getDataAsGraph, setupToolBar} from "../helpers/dataRendererHelper.js";

export default class Props {
    constructor() {
        document.title = "Props";
        this.returnRenderFunc = getDataAsGraph;
        this.view = "props";
    }
    async getTemplate() { return this.returnRenderFunc("props") }
    async setupToolBar() { return setupToolBar("props") }
}