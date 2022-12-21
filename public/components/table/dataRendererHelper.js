import Graph from "../graph/Graph.js";
import {createHtmlElementWithData} from "../DomElementHelper.js";

function sortFunc(a, b, propName) { return (a[propName] > b[propName]) ? 1 : ((b[propName] > a[propName]) ? -1 : 0) }
function propFixedSortFunc(propName) { return (a, b) => sortFunc(a, b, propName) }
function propFixedSortReversedFunc(propName) { return (a, b) => sortFunc(a, b, propName) * -1 }

function generateDataTable(tableData, idName, sortFunc) {
  let max = Object.keys(tableData[0]).length;
  let largestObj = tableData[0];
  tableData.forEach(i => {
    if (Object.keys(i).length > max) {
      max = Object.keys(i).length;
      largestObj = i;
    }
  });
  const sortedObjectList = Object.values(tableData).sort(sortFunc);
  let headerNodes = []
  const tableIdHeaderNode = createHtmlElementWithData("th", { "scope": "col", "id": idName + "id" })
  tableIdHeaderNode.innerHTML = "id"
  headerNodes.push(tableIdHeaderNode)
  const tableHeaderRowNode = createHtmlElementWithData("tr")
  tableHeaderRowNode.appendChild(tableIdHeaderNode)
  const tableRootNode = createHtmlElementWithData("table", { "class": "table" })
  let i = 0;
  for (let header in largestObj) {
    if(i === 3) {
      break;
    }
    if (header === "id") {
      continue;
    }
    let newHeaderElement = createHtmlElementWithData("th", { "scope": "col", "id": idName + header })
    newHeaderElement.innerHTML = header
    tableHeaderRowNode.appendChild(newHeaderElement)
    headerNodes.push(newHeaderElement)
    i = i + 1;
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

export async function renderDataAsGraph(viewName) {
  return await Graph(viewName)
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
    if(nodes !== undefined && nodes.length > 0){
      let { dataTable, headerRow } = await generateDataTable(nodes, "nodes", nodesTableSortFunc)
      for (let thNode of headerRow) {
        thNode.addEventListener("click", async () => {
          if (clickedHeader === thNode.innerHTML && wasReversedSorted === false) {
            setAppDivOnCallback(await renderDataAsTable(viewName, propFixedSortReversedFunc(thNode.innerHTML), relsTableSortFunc, thNode.innerHTML, true))
          } else {
            setAppDivOnCallback(await renderDataAsTable(viewName, propFixedSortFunc(thNode.innerHTML), relsTableSortFunc, thNode.innerHTML, false))
          }
        });
      }
      nodeTableDiv.appendChild(dataTable)
    }
  }

  const setAppDivOnCallback = function (tableDivs) {
    document.querySelector("#filterbox-grid-container-id").innerHTML = ""
    document.querySelector("#filterbox-grid-container-id").appendChild(tableDivs[0]);
  }
  return [nodeTableDiv, async () => await setAppDivOnCallback(await renderDataAsTable(viewName))]
}