import Graph from "../components/graph/Graph.js";
import Actions from "../store/Actions.js";

function sortFunc(a,b, propName) { return (a[propName] > b[propName]) ? 1 : ((b[propName] > a[propName]) ? -1 : 0)}
function propFixedSortFunc(propName) { return (a,b) => sortFunc(a,b,propName) }
 
function generateDataTable(tableData, idName, sortFunc) {
    var max = Object.keys(tableData[0]).length
    var largestObj = tableData[0];
    tableData.forEach(i=>{
      if(Object.keys(i).length> max){
        max = Object.keys(i).length;
        largestObj = i;
      }
    });
    var sortedObjectList = Object.values(tableData).sort(sortFunc);
    let headerNodes = []
    const tableIdHeaderNode = createHtmlElementWithData("th", {"scope": "col", "id":idName+"id"})
    tableIdHeaderNode.innerHTML = "Id"
    headerNodes.push(tableIdHeaderNode)
    const tableHeaderRowNode = createHtmlElementWithData("tr")
    tableHeaderRowNode.appendChild(tableIdHeaderNode)
    const tableRootNode = createHtmlElementWithData("table")
    tableRootNode.appendChild(tableHeaderRowNode)
    for (let header in largestObj){
      if(header === "id"){
        continue;
      }
      let newHeaderElement = createHtmlElementWithData("th", {"scope": "col", "id":idName+header})
      newHeaderElement.innerHTML = header
      tableHeaderRowNode.appendChild(newHeaderElement)
      headerNodes.push(newHeaderElement)
    }
    
    sortedObjectList.forEach((dataObject, index, array) => {
      let dataRowNode = createHtmlElementWithData("tr")
      let dataTdIdNode = createHtmlElementWithData("td")
      dataTdIdNode.innerHTML = dataObject["id"]
      dataRowNode.appendChild(dataTdIdNode)
      for (let el in dataObject) {
        if(el === 'id'){
          continue;
        }
        let dataTdNode = createHtmlElementWithData("td")
        dataTdNode.innerHTML = dataObject[el]
        dataRowNode.appendChild(dataTdNode)
        
      }
      tableRootNode.appendChild(dataRowNode)
    }); 
    return {dataTable: tableRootNode, headerRow: headerNodes};
}

export async function getTemplateSuper(renderFunc, viewName) {
  await Actions.GETALL(viewName)
  return await renderFunc(viewName)
}

export async function renderDataAsGraph(viewName){
  const graphView = await Graph(viewName)
  document.querySelector("#app").appendChild( graphView);
  return graphView;
}

export async function renderDataAsTable(viewName, 
    nodesTableSortFunc = (a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0),
    relsTableSortFunc = (a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0)) {
  let nodes,
  rels = [];
  let graphJsonData = await JSON.parse(sessionStorage.getItem(viewName));
  nodes = graphJsonData[0].nodes;
  rels = graphJsonData[0].rels;

  var {dataTable,headerRow} = await generateDataTable(nodes, "nodes", nodesTableSortFunc)
  for(let thNode of headerRow){
    thNode.addEventListener("click", async () => {
      await renderDataAsTable(viewName, propFixedSortFunc(thNode.innerHTML), relsTableSortFunc)
    });
  }
  const nodeTableDiv = createHtmlElementWithData('div',{"id": "nodeTableDivName"})
  nodeTableDiv.appendChild(dataTable)

  var {dataTable,headerRow} = await generateDataTable(rels, "rels", relsTableSortFunc)
  for(let thNode of headerRow){
    thNode.addEventListener("click", async () => {
      await renderDataAsTable(viewName, nodesTableSortFunc, propFixedSortFunc(thNode.innerHTML))
    });
  } 
  const relTableDiv = createHtmlElementWithData('div',{"id": "relTableDivName"})
  relTableDiv.appendChild(dataTable)

  document.querySelector("#app").innerHTML = ""
  const containerDiv = createHtmlElementWithData('div',{"id": "nodeTableContainerDiv"})
  containerDiv.appendChild(nodeTableDiv);
  containerDiv.appendChild(relTableDiv);
  document.querySelector("#app").appendChild(containerDiv);
  return containerDiv;

}

export async function getDataAsGraph(viewName) { return await getTemplateSuper(renderDataAsGraph, viewName); }
export async function getDataAsTable(viewName) { return await getTemplateSuper(renderDataAsTable, viewName); }

export function setupToolBar(viewName) {
  document.querySelector("#toolBar").innerHTML = "";

  const toTable = createHtmlElementWithData("button",{}, "View As Table")
  toTable.innerHTML = "View As Table"
  toTable.addEventListener("click", async () => {
    document.querySelector("#app").innerHTML = "";
    await getDataAsTable(viewName)
  });
  document.querySelector("#toolBar").appendChild(toTable);

  const toGraph = createHtmlElementWithData("button",{}, "View As Graph")
  toGraph.innerHTML = "View As Graph"
  toGraph.addEventListener("click", async () => {
      document.querySelector("#app").innerHTML = ""
      await getDataAsGraph(viewName)
  });
  document.querySelector("#toolBar").appendChild(toGraph);
}

function createHtmlElementWithData(elementName, attributeData={}){
  let newElement = document.createElement(elementName);
  for(let [key, value] of Object.entries(attributeData)){
    newElement.setAttribute(key, value)
  }
  return newElement
}