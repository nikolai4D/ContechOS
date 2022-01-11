import Graph from "../components/Graph.js"

export default class Config {
    
    constructor() {
        document.title = "Config";
    }

    async getTemplate() {
        return Graph("config")
    }
}

