import {State} from "../../store/State.js";
import { iconEye } from "./toggleHideShow.js";
import { chevronDown } from ".././Icons.js";

async function FilterBox() {
  let nodeHtmlString = await triggerTreeGetHtml();

  const htmlString = `
<div class="accordion w-25 position-fixed open" draggable="true" id="accordionPanelsStayOpenExample">
  <div class="accordion-item">
    <h2 class="accordion-header" id="panelsStayOpen-headingOne">
      <button id= "filter-box-handle" class="accordion-button col-sm" type="button" draggable="true" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
        Filter
      </button>
    </h2>
    <div id="panelsStayOpen-collapseOne" class="accordion-collapse show" aria-labelledby="panelsStayOpen-headingOne">
    <div id="accordion-container-switch-modalbtn" class="d-flex justify-content-end"></div>
      <div class="accordion-body" id="accordion-body-id">
      ${nodeHtmlString}
      </div>
    </div>
    </div>
</div>  
            `


  let filterDOM = document.createElement("div");
  filterDOM.className = "filter-container container-fluid  m-0 p-0"
  filterDOM.id = "filter-container-id"
  filterDOM.innerHTML = htmlString;
  return filterDOM;
}

async function triggerTreeGetHtml() {
  let tree = State.treeOfNodes.tree;
  await State.treeOfNodes.ensureInit();

  let nodeHtmlString = ``;
  tree.sort((a, b) => a.title.localeCompare(b.title));

  tree.forEach(node => {
    nodeHtmlString += itemRow(node);
  }
  );
  return nodeHtmlString;
}

function itemRow(node){
    if(node.excluded) return ""

    let childrenFrame = ``

    if (node.selected === true && node.hasOwnProperty("children") && node.children.length !== 0){
      childrenFrame = `
            <ul style="margin-bottom:0;">
            <input class="form-check-input" type="checkbox" value="" id="all_${node.id}"  ${ node.viewAll? "checked": ""}>
            <label class="form-check-label text-break" for="all_${node.id}"> All</label>
            <br/>`
      
      node.children.sort((a, b) => a.title.localeCompare(b.title));

      for(let child of node.children){
            childrenFrame += itemRow(child)
      }

        if(childrenFrame.lastIndexOf("<br/>") === childrenFrame.length - 5 ){
            childrenFrame = childrenFrame.slice(0, -5)
        }

      childrenFrame += `</ul>`
    }

    const eye = node.hidden? iconEye(node.id).hide : iconEye(node.id).show
    const eyeDiv = `<div class="d-inline-block" id="toggleEyeContainer_${node.id}">${eye}</div>`

    let mainrow = ""
    if(childrenFrame !== ''){
      mainrow = `
        <div id="acc_${node.id}-heading" class="d-inline-block" role="button">
          <input class="form-check-input" type="checkbox" value="" id="checkbox_${node.id}" ${ node.selected? "checked": ""}>
          <label class="form-check-label text-break" for="checkbox_${node.id}"> ${node.title}</label> 
          ${ node.selected? eyeDiv : ""}
          <div class="d-inline-block" 
            <button type="button" class="btn" data-bs-toggle="collapse" data-bs-target="#acc_${node.id}-collapse" aria-expanded="false" aria-controls="acc_${node.id}-collapse">
              ${chevronDown('role="button"')}
            </button>
          </div>
        </div>
        <div id="acc_${node.id}-collapse" class="accordion-collapse collapse show" aria-labelledby="acc_${node.id}-heading">      
          ${ childrenFrame }
        </div>
        <br/>`
    } else  {    
      mainrow = `
        <div id="form-check-input-container" class="d-inline-block" role="button">
          <input class="form-check-input" type="checkbox" value="" id="checkbox_${node.id}" ${ node.selected? "checked": ""}>
          <label class="form-check-label text-break" for="checkbox_${node.id}"> ${node.title}</label> 
          ${ node.selected? eyeDiv : ""}
        </div>
        <br/>`
    }

    return mainrow
}


export {FilterBox, triggerTreeGetHtml};