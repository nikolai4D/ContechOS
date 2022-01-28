import Graph from "../components/Graph.js"
import store from "../store/store.js"

export default class Props {
    
    constructor() {
        document.title = "Props";
    }

    async getTemplate() {
        const view = "props"
        await store.GETALL(view)
        return Graph(view)
    }
}