import Graph from "../components/Graph.js"


export default class Data {
    
    constructor() {
        document.title = "Data";
    }

    async getTemplate() {
        return Graph("data")
    }
}

