import Graph from "../graph/Graph.js";
import Actions from "../../store/Actions.js";

function sortFunc(a, b, propName) { return (a[propName] > b[propName]) ? 1 : ((b[propName] > a[propName]) ? -1 : 0) }
function propFixedSortFunc(propName) { return (a, b) => sortFunc(a, b, propName) }
function propFixedSortReversedFunc(propName) { return (a, b) => sortFunc(a, b, propName) * -1 }

function generateDataTable(tableData, idName, sortFunc) {
  var max = Object.keys(tableData[0]).length
  var largestObj = tableData[0];
  tableData.forEach(i => {
    if (Object.keys(i).length > max) {
      max = Object.keys(i).length;
      largestObj = i;
    }
  });
  var sortedObjectList = Object.values(tableData).sort(sortFunc);
  let headerNodes = []
  const tableIdHeaderNode = createHtmlElementWithData("th", { "scope": "col", "id": idName + "id" })
  tableIdHeaderNode.innerHTML = "id"
  headerNodes.push(tableIdHeaderNode)
  const tableHeaderRowNode = createHtmlElementWithData("tr")
  tableHeaderRowNode.appendChild(tableIdHeaderNode)
  const tableRootNode = createHtmlElementWithData("table", { "class": "table" })
  for (let header in largestObj) {
    if (header === "id") {
      continue;
    }
    let newHeaderElement = createHtmlElementWithData("th", { "scope": "col", "id": idName + header })
    newHeaderElement.innerHTML = header
    tableHeaderRowNode.appendChild(newHeaderElement)
    headerNodes.push(newHeaderElement)
  }
  let tableHeaderTheadNode = createHtmlElementWithData("thead")
  tableHeaderTheadNode.appendChild(tableHeaderRowNode)
  tableRootNode.appendChild(tableHeaderTheadNode)

  let dataTableBodyNode = createHtmlElementWithData("tbody")
  sortedObjectList.forEach((dataObject, index, array) => {
    let dataRowNode = createHtmlElementWithData("tr")
    //let dataTdIdNode = createHtmlElementWithData("td")
    //dataTdIdNode.innerHTML = dataObject["id"]
    //dataRowNode.appendChild(dataTdIdNode)
    for (let headNode of headerNodes) {
      let dataTdNode = createHtmlElementWithData("td")
      dataTdNode.innerHTML = dataObject[headNode.innerHTML]
      if (dataTdNode.innerHTML === "undefined") {
        dataTdNode.innerHTML = ""
      }
      dataRowNode.appendChild(dataTdNode)
    }
    dataTableBodyNode.appendChild(dataRowNode)
  });
  tableRootNode.appendChild(dataTableBodyNode)
  return { dataTable: tableRootNode, headerRow: headerNodes };
}

export async function getTemplateSuper(renderFunc, viewName) {
  await Actions.GETALL(viewName)
  return await renderFunc(viewName)
}

export async function renderDataAsGraph(viewName) {
  const graphView = await Graph(viewName)
  document.querySelector("#app").appendChild(graphView);
  return graphView;
}

export async function renderDataAsTable(viewName,
  nodesTableSortFunc = (a, b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0),
  relsTableSortFunc = (a, b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0),
  clickedHeader = "",
  wasReversedSorted = false) {
  let nodes,
    rels = [];
  let graphJsonData = await JSON.parse(sessionStorage.getItem(viewName));
  nodes = graphJsonData[0].nodes;
  rels = graphJsonData[0].rels;

  const nodeTableDiv = createHtmlElementWithData('div', { "id": "nodeTableDivName" })
  {
    let { dataTable, headerRow } = await generateDataTable(nodes, "nodes", nodesTableSortFunc)
    for (let thNode of headerRow) {
      thNode.addEventListener("click", async () => {
        console.log(clickedHeader === thNode.innerHTML)
        if (clickedHeader === thNode.innerHTML && wasReversedSorted === false) {
          await renderDataAsTable(viewName, propFixedSortReversedFunc(thNode.innerHTML), relsTableSortFunc, thNode.innerHTML, true)
        } else {
          await renderDataAsTable(viewName, propFixedSortFunc(thNode.innerHTML), relsTableSortFunc, thNode.innerHTML, false)
        }
      });
    }
    nodeTableDiv.appendChild(dataTable)
  }

  const relTableDiv = createHtmlElementWithData('div', { "id": "relTableDivName" })
  {
    let { dataTable, headerRow } = await generateDataTable(rels, "rels", relsTableSortFunc)
    for (let thNode of headerRow) { // await renderDataAsTable(viewName, nodesTableSortFunc, propFixedSortFunc(thNode.innerHTML))
      thNode.addEventListener("click", async () => {
        if (clickedHeader === thNode.innerHTML && wasReversedSorted === false) {
          await renderDataAsTable(viewName, nodesTableSortFunc, propFixedSortReversedFunc(thNode.innerHTML), thNode.innerHTML, true)
        } else {
          await renderDataAsTable(viewName, nodesTableSortFunc, propFixedSortFunc(thNode.innerHTML), thNode.innerHTML, false)
        }
      });
    }
    relTableDiv.appendChild(dataTable)
  }

  document.querySelector("#app").innerHTML = ""
  const containerDiv = createHtmlElementWithData('div', { "id": "nodeTableContainerDiv" })
  containerDiv.appendChild(nodeTableDiv);
  containerDiv.appendChild(relTableDiv);
  document.querySelector("#app").appendChild(containerDiv);
  return containerDiv;

}

export async function getDataAsGraph(viewName) { return await getTemplateSuper(renderDataAsGraph, viewName); }
export async function getDataAsTable(viewName) { return await getTemplateSuper(renderDataAsTable, viewName); }

export function setupToolBar(viewName) {
  document.querySelector("#toolBar").innerHTML = "";

  const toTable = createHtmlElementWithData("button", {}, "View As Table")
  toTable.innerHTML = "View As Table"
  toTable.addEventListener("click", async () => {
    document.querySelector("#app").innerHTML = "";
    await getDataAsTable(viewName)
  });
  document.querySelector("#toolBar").appendChild(toTable);

  const toGraph = createHtmlElementWithData("button", {}, "View As Graph")
  toGraph.innerHTML = "View As Graph"
  toGraph.addEventListener("click", async () => {
    document.querySelector("#app").innerHTML = ""
    await getDataAsGraph(viewName)
  });
  document.querySelector("#toolBar").appendChild(toGraph);
}

function createHtmlElementWithData(elementName, attributeData = {}) {
  let newElement = document.createElement(elementName);
  for (let [key, value] of Object.entries(attributeData)) {
    newElement.setAttribute(key, value)
  }
  return newElement
}