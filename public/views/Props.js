import Actions from "../store/Actions.js";
import { renderDataAsGraph} from "../components/table/dataRendererHelper.js";
import {createHtmlElementWithData, appendChildsToSelector} from "../components/DomElementHelper.js";

export default class Props {
    constructor() {
        document.title = "Props";
        this.returnRenderFunc = renderDataAsGraph;
        this.view = "props";
    }
    async getTemplate() { 
        console.log("props")
        await Actions.GETALL("props")
        return (await this.returnRenderFunc("props"))[0]
    }
}