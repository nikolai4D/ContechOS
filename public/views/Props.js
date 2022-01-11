import Graph from "../components/Graph.js"

export default class Props {
    
    constructor() {
        document.title = "Props";
    }

    async getTemplate() {
        return Graph("props")
    }
}

