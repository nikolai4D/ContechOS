import Graph from "../components/graph/Graph.js"
import Actions from "../store/Actions.js";
import Filter from "../components/filter/Filter.js";

export default class Configs {

    constructor() {
        document.title = "Config";
    }

    async getTemplate() {
        const view = "configs"
        await Actions.GETALL(view)
        Filter(view);

        return Graph(view)
    }
}

