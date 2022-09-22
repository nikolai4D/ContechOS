import Graph from "../graph/Graph.js"

async function checkFilter(event) {

    let nodes,
        rels = [];

    let view = window.location.pathname.substring(1)

    let graphJsonData = await JSON.parse(sessionStorage.getItem(`${view}_full`));
    let graphJsonDataGraph = await JSON.parse(sessionStorage.getItem(`${view}`));

    nodes = graphJsonData[0].nodes;
    let nodeId = event.target.id.split("checkbox_")[1]
    let checkedNode = nodes.find(node => node.id === nodeId);
    let isChecked = event.target.checked
    if (isChecked) {
        console.log("hello")
    }
    else {
        let nodesGraph = graphJsonData[0].nodes;
        let relsGraph = graphJsonData[0].rels;

        graphJsonData[0].nodes = nodesGraph.filter(node => node.id !== nodeId)
        graphJsonData[0].rels = relsGraph.filter(rel => rel.source !== nodeId || rel.target !== nodeId)

        sessionStorage.setItem(`${view}`, JSON.stringify(graphJsonData));
        console.log(`REMOVED ${nodeId}`)

        await document.getElementsByTagName("svg")[0].remove();
        await document.getElementById("app").append(await Graph(view))
    }


    rels = graphJsonData[0].rels;



    console.log(view, event.target.checked, checkedNode)



    // let id = event.target.parentElement.id;

}


export default checkFilter;