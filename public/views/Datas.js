import Graph from "../components/Graph.js"
import store from "../store/store.js"


export default class Datas {
    
    constructor() {
        document.title = "Data";
    }

    async getTemplate() {
        const view = "datas"
        await store.GETALL(view)
        return Graph(view)
        
        
        
    }
}

