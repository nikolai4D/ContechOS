import {State} from "../../store/State.js";
import { iconEye } from "./toggleHideShow.js";

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


  let filterDOM = document.createElement("div");
  filterDOM.className = "filter-container container-fluid"
  filterDOM.innerHTML = htmlString;
  return filterDOM;
}

function itemRow(node){
    if(node.hidden) return ""

    let childrenFrame = `<br/>`

    if (node.selected === true && node.hasOwnProperty("children") && node.children.length !== 0){
      childrenFrame = `
            <ul>
            <input class="form-check-input" type="checkbox" value="" id="all_${node.id}" data-function="checkAll" ${ node.viewAll? "checked": ""}>
            <label class="form-check-label" for="all_${node.id}"> All</label>
            <br/>
          `
      for(let child of node.children){
            childrenFrame += itemRow(child)
      }

      childrenFrame += `</ul>`
    }

    const iconShow = `<div class="d-inline-block" id="toggleEyeContainer_${node.id}">${iconEye(node.id).show}</div>`
  
  
     let mainRow = `
     <div id="form-check-input-container" class="d-inline-block" role="button">
          <input class="form-check-input" type="checkbox" value="" id="checkbox_${node.id}" data-function="checkFilter" ${ node.selected? "checked": ""}>
          <label class="form-check-label" for="checkbox_${node.id}"> ${node.title}</label> ${ node.selected? iconShow : ""}
          </div>
          ${ childrenFrame }
     `

    return mainRow
}

export default FilterBox;
