import Graph from "../components/graph/Graph.js";
import Actions from "../store/Actions.js";

export default class Props {

    constructor() {
        document.title = "Props";
    }

    async getTemplate() {
        const view = "props"
        await Actions.GETALL(view)
        return Graph(view)
    }
}