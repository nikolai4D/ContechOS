import {State} from "../../store/State.js";
import navigateTo from "../../helpers/navigateTo.js";
//import { appendChildsToSelector } from "../table/dataRendererHelper.js";
import Graph from "../graph/Graph.js";
import { createHtmlElementWithData, appendChildsToSelector } from "../table/dataRendererHelper.js";

async function FilterBox() {

  let tree = State.treeOfNodes.tree
    await State.treeOfNodes.ensureInit()

  let nodeHtmlString = ``
  tree.forEach(node => {
        nodeHtmlString += itemRow(node)
      }
  )

  const htmlString = `
<div class="accordion w-25 position-absolute open" id="accordionPanelsStayOpenExample">
  <div class="accordion-item">
    <h2 class="accordion-header" id="panelsStayOpen-headingOne">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
        Filter
      </button>
    </h2>
    <div id="panelsStayOpen-collapseOne" class="accordion-collapse show" aria-labelledby="panelsStayOpen-headingOne">
      <div class="accordion-body">
      ${nodeHtmlString}
      </div>
    </div>
    </div>
</div>  
            `
  let accordionDiv = createHtmlElementWithData("div", {"class": "accordion w-25 position-absolute open", 
    "id": "accordionPanelsStayOpenExample"});
    let accordionItemDiv = createHtmlElementWithData("div", {"class": "accordion-item"});
      let accordianH2 = createHtmlElementWithData("h2", {"class": "accordion-header", "id": "panelsStayOpen-headingOne"});
        let accordionToggleButton = createHtmlElementWithData("button", {"class": "accordion-button", "type": "button",
          "data-bs-toggle": "collapse", "data-bs-target": "#panelsStayOpen-collapseOne", "aria-expanded": "true",
          "aria-controls": "panelsStayOpen-collapseOne"});
      let panelstayOpenDiv = createHtmlElementWithData("div", {"id": "panelsStayOpen-collapseOne", "class": "accordion-collapse show",
        "aria-labelledby": "panelsStayOpen-headingOne"});
        let accordionBodyDiv = createHtmlElementWithData("div", {});

  let filterDOM = document.createElement("div");
  filterDOM.className = "filter-container"
  filterDOM.id = "filter-container-box"
  filterDOM.innerHTML = htmlString;

  console.log("test!")
  console.log(test)
  return filterDOM;
}

function itemRow(node){
    if(node.hidden) return ""

    let childrenFrame = `<br/>`

    if (node.selected === true && node.hasOwnProperty("children") && node.children.length !== 0){
      childrenFrame = `
            <ul>
            <input class="form-check-input" type="checkbox" value="" id="all_${node.id}" data-function="checkAll" ${ node.isViewAllChecked? "checked": ""}>
            <label class="form-check-label" for="all_${node.id}"> All</label>
            <br/>
            
          `
      for(let child of node.children){
            childrenFrame += itemRow(child)
      }

      childrenFrame += `</ul>`
    }

     let mainRow = `
          <input class="form-check-input" type="checkbox" value="" id="checkbox_${node.id}" data-function="checkFilter" ${ node.selected? "checked": ""}>
          <label class="form-check-label" for="checkbox_${node.id}"> ${node.title}</label>
          
          ${ childrenFrame }
     `

    return mainRow
}

async function checkFilter(event) {
  const tree = State.treeOfNodes

  let input =getInputFromEvent(event)
  input.toggleAttribute("checked")

  const treeNode = tree.getNodeById(input.id.substring(9))
  treeNode.selected? treeNode.deselectLineage() : treeNode.selected = true

  await tree.shake()

  var div = document.querySelector('#filter-container-box');
  if (div) {
      div.parentNode.removeChild(div);
  }
  await tree.ensureInit()
  tree.visibleRelations.map(rel => {
      rel.source = rel.sourceId
      rel.target = rel.targetId
      return rel
  })
  await sessionStorage.setItem("filter", JSON.stringify([{nodes: tree.selectedNodesData , rels: tree.visibleRelations }]));
  const update = State.graphObject['updateGraphFunc']
  await update('filter')
  //appendChildsToSelector("#app", await FilterBox())
  //document.querySelector("#app").innerHTML = ""
  //const mainAppNodes = await Graph('filter')
  //const filterBoxNodes = await FilterBox()
  //appendChildsToSelector("#app", [mainAppNodes,filterBoxNodes])
  //navigateTo('/filter')
}

export async function checkAll(event) {
  let input = getInputFromEvent(event)
  input.toggleAttribute("checked")

  const tree = State.treeOfNodes
  const treeNode = tree.getNodeById(input.id.substring(4))
  treeNode.isViewAllChecked = !treeNode.isViewAllChecked
  if (treeNode.isViewAllChecked) {
      console.log("check all")
      treeNode.selectChildren()
  } else {
      console.log("uncheck all")
      treeNode.deselectLineage()
      treeNode.selected = true

  }

  await tree.shake()

  var div = document.querySelector('#filter-container-box');
  if (div) {
      div.parentNode.removeChild(div);
  }
  await tree.ensureInit()
  tree.visibleRelations.map(rel => {
      rel.source = rel.sourceId
      rel.target = rel.targetId
      return rel
  })
  await sessionStorage.setItem("filter", JSON.stringify([{nodes: tree.selectedNodesData , rels: tree.visibleRelations }]));
  document.querySelector("#app").innerHTML = ""
  const mainAppNodes = await Graph('filter')
  const filterBoxNodes = await FilterBox()
  appendChildsToSelector("#app", [mainAppNodes,filterBoxNodes])
}

function getInputFromEvent(event){
  if(event.target.tagName === "LABEL") return document.getElementById(event.target.getAttribute("for"))
  else if ( event.target.tagName === "INPUT" ) return event.target
  else console.log("tagname: " + event.target.tagName)
}

export default FilterBox;