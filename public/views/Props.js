import Graph from "../components/graph/Graph.js";
import Actions from "../store/Actions.js";
import generateDataTable from "../helpers/dataTableGenerator.js";

export default class Props {
    
    constructor() {
        document.title = "Props";
        this.returnRenderFunc = this.getDataAsGraph;
        this.view = "props";
        console.log("created props class")
    }

    async getTemplate() {
        return this.returnRenderFunc()
    }

    async getTemplateSuper(renderFunc) {
        await Actions.GETALL("props")
        return renderFunc()
    }

    async renderDataAsGraph(){
        return Graph("props");
    }

    async renderDataAsTable() {
        let nodes,
        rels = [];
        let graphJsonData = await JSON.parse(sessionStorage.getItem("props"));
        nodes = graphJsonData[0].nodes;
        rels = graphJsonData[0].rels;

        let dataTable = await generateDataTable(nodes)
        return dataTable
    }
    async getDataAsGraph() { return this.getTemplateSuper(this.renderDataAsGraph); }
    async getDataAsTable() { return this.getTemplateSuper(this.renderDataAsTable); }
    async changeToTable() { document.querySelector("#app").innerHTML = await view.getTemplate(); }
    async getToolBar() { return `<button id="myButton">Click me!</button>}`;}
    async setupToolBar() {
        document.querySelector("#toolBar").innerHTML = "";
        const toTable = document.createElement("toTable");
        toTable.innerHTML = "View As Table";
        toTable.addEventListener("click", async () => {
            document.querySelector("#app").innerHTML = "";
            document.querySelector("#app").innerHTML = await this.getDataAsTable()
        });
        document.querySelector("#toolBar").appendChild(toTable);

        const toGraph = document.createElement("toGraph");
        toGraph.innerHTML = "View As Graph";
        toGraph.addEventListener("click", async () => {
            document.querySelector("#app").innerHTML = ""
            document.querySelector("#app").appendChild(await this.getDataAsGraph())
        });
        document.querySelector("#toolBar").appendChild(toGraph);
    }

}