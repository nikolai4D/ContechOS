import Graph from "../components/Graph.js"
import Actions from "../store/Actions.js";

export default class Configs {

    constructor() {
        document.title = "Config";
    }

    async getTemplate() {
        const view = "configs"
        await Actions.GETALL(view)
        return Graph(view)
    }
}

