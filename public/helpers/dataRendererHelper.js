import Graph from "../components/graph/Graph.js";
import Actions from "../store/Actions.js";

function generateDataTable(tableData) {
    var max = Object.keys(tableData[0]).length
    var largestObj = tableData[0];
    tableData.forEach(i=>{
      if(Object.keys(i).length> max){
        max = Object.keys(i).length;
        largestObj = i;
      }
    });
    var sortedObjectList = Object.values(tableData).sort(function(a,b) {return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0);} );
    
    let result = '<table><tr><th scope="col">Id</th>';
    for (let header in largestObj){
      if(header === "id"){
        continue;
      }
      result += `<th scope="col">${header}</th>`
    }
    result += `</tr>`
    sortedObjectList.forEach((dataObject, index, array) => {
      result += `<tr><td>${dataObject["id"]}</td>`
      for (let el in dataObject) {
        if(el === 'id'){
          continue;
        } else{
          result += `<td>${dataObject[el]}</td>`;
        }
      }
      result += `</tr>`
    });
    result += '</table>'; 
    return result;
}

export async function getTemplateSuper(renderFunc, viewName) {
  await Actions.GETALL(viewName)
  return renderFunc(viewName)
}

export async function renderDataAsGraph(viewName){
  return Graph(viewName);
}

export async function renderDataAsTable(viewName) {
  let nodes,
  rels = [];
  let graphJsonData = await JSON.parse(sessionStorage.getItem(viewName));
  nodes = graphJsonData[0].nodes;
  rels = graphJsonData[0].rels;

  let dataTable = await generateDataTable(nodes)
  return dataTable
}

export async function getDataAsGraph(viewName) { return getTemplateSuper(renderDataAsGraph, viewName); }
export async function getDataAsTable(viewName) { return getTemplateSuper(renderDataAsTable, viewName); }

export async function setupToolBar(viewName) {
  document.querySelector("#toolBar").innerHTML = "";
  const toTable = document.createElement("toTable");
  toTable.innerHTML = "View As Table";
  toTable.addEventListener("click", async () => {
      document.querySelector("#app").innerHTML = "";
      document.querySelector("#app").innerHTML = await getDataAsTable(viewName)
  });
  document.querySelector("#toolBar").appendChild(toTable);

  const toGraph = document.createElement("toGraph");
  toGraph.innerHTML = "View As Graph";
  toGraph.addEventListener("click", async () => {
      document.querySelector("#app").innerHTML = ""
      document.querySelector("#app").appendChild(await getDataAsGraph(viewName))
  });
  document.querySelector("#toolBar").appendChild(toGraph);
}
