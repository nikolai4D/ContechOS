import Graph from "../components/Graph.js"
import store from "../store/store.js"

export default class Configs {
    
    constructor() {
        document.title = "Config";
    }

    async getTemplate() {
        const view = "configs"
        await store.GETALL(view)
        return Graph(view)
    }
}

